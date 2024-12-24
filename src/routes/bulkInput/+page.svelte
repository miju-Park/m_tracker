<script lang="ts">
	import type { User } from 'firebase/auth';
	import { configStore } from '../../store/configStore';
	import { transactionHandlers } from '../../store/transaction';
	import { authStore } from '../../store/store';
	import { onMount } from 'svelte';
	import { collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
	import { itemData } from './data';
	import { db } from '@/firebase/firebase';
	import * as xlsx from 'xlsx';

	let configList: Config[] = [];
	let user: User | null;

	const unsubConfig = configStore.subscribe((cur) => {
		configList = cur;
	});
	const unsubscribe = authStore.subscribe(async (curr) => {
		try {
			user = curr.user;
		} catch (error) {
			console.error(error);
		}
	});

	const insertDb = async (data: {
		type: string;
		category: string;
		date: string;
		description: string;
		amount: number;
	}) => {
		await transactionHandlers.add({
			...data,
			userId: user?.uid ?? '',
			date: Timestamp.fromDate(new Date(data.date))
		});
	};
	const processImport = async () => {
		for await (const item of itemData) {
			const { description, date, type, amount, category } = item;

			await insertDb({
				description,
				date,
				type,
				amount,
				category
			});
		}
	};

	// Define the collection name
	const COLLECTION_NAME = 'transactions';

	// Define the columns for the output
	const OUTPUT_COLUMNS = ['date', 'type', 'category', 'amount', 'description', 'memo'];

	// Function to group transactions by month (from 25th to 24th of the next month)
	function groupByCustomMonths(transactions: TransactionType[]): Record<string, any[]> {
		const grouped: Record<string, any[]> = {};

		transactions.forEach((transaction) => {
			const date = transaction.date.toDate();
			let year = date.getFullYear();
			let month = date.getMonth();
			const day = date.getDate();

			// Adjust month based on the 25th cutoff
			if (day >= 25) {
				month += 1;
				if (month > 11) {
					month = 0;
					year += 1;
				}
			}

			const monthKey = `${year}-${`${month + 1}`.padStart(2, '0')}`;

			if (!grouped[monthKey]) {
				grouped[monthKey] = [];
			}

			if (transaction.type === 'withdraw') {
				const configTarget = configList.find(
					(config) => config.type === 'withdraw' && config.subCategory === transaction.category
				);
				transaction.category = `[${configTarget?.category}] ${transaction.category}`;
			}

			grouped[monthKey].push({
				...transaction,
				type:
					transaction.type === 'income' ? '수입' : transaction.type === 'expense' ? '지출' : '이체',
				amount: transaction.amount.toLocaleString(),
				date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
			});
		});

		return grouped;
	}

	// Function to fetch data from Firestore
	async function fetchTransactions(): Promise<any[]> {
		const transactionsRef = collection(db, COLLECTION_NAME);
		const q = query(transactionsRef, where('userId', '==', user?.uid), orderBy('date', 'desc'));
		const snapshot = await getDocs(q);

		const transactions: any[] = [];

		snapshot.forEach((doc) => {
			const data = doc.data();
			transactions.push({
				id: doc.id,
				...data
			});
		});

		return transactions;
	}

	async function generateExcel(): Promise<Blob> {
		try {
			const transactions = await fetchTransactions();
			const groupedTransactions = groupByCustomMonths(transactions);

			const workbook = xlsx.utils.book_new();

			Object.entries(groupedTransactions).forEach(([month, data]) => {
				const rows = data.map((transaction) => OUTPUT_COLUMNS.map((col) => transaction[col] || ''));
				const sheetData = [OUTPUT_COLUMNS, ...rows];
				const worksheet = xlsx.utils.aoa_to_sheet(sheetData);

				xlsx.utils.book_append_sheet(workbook, worksheet, month);
			});

			const excelBuffer = xlsx.write(workbook, { type: 'array' });
			return new Blob([excelBuffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
		} catch (error) {
			console.error('Error generating Excel file:', error);
			throw error;
		}
	}

	async function downloadExcel() {
		const excelBlob = await generateExcel();
		const url = URL.createObjectURL(excelBlob);
		const a = document.createElement('a');
		a.href = url;
		a.download = '2024.xlsx';
		a.click();
		URL.revokeObjectURL(url);
	}

	onMount(() => {
		return () => {
			unsubConfig();
			unsubscribe();
		};
	});
</script>

<button on:click={processImport}>Import</button>
<button on:click={downloadExcel}>Export</button>
