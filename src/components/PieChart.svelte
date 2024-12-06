<script lang="ts">
	import * as d3 from 'd3';
	import { afterUpdate, onMount } from 'svelte';

	interface PieChartData {
		label: string;
		value: number;
		color?: string;
	}
	export let data: Array<PieChartData> = [];
	export let defaultColors: readonly string[] = d3.schemeCategory10;
	let width: number;
	let height: number;

	let svgElement: SVGSVGElement;
	let tooltipElement: HTMLDivElement;
	let chartContainer: HTMLDivElement;

	$: totalValue = data.reduce((sum, item) => sum + item.value, 0);

	$: if (width && height) {
		drawChart();
	}

	function drawChart() {
		let innerRadius: number = 0;
		let outerRadius: number = Math.min(width, height) / 2;
		// Clear any existing content
		d3.select(svgElement).selectAll('*').remove();

		// Create the pie layout
		const pie = d3
			.pie<PieChartData>()
			.value((d) => d.value)
			.sort(null);

		// Create an arc generator
		const arc = d3
			.arc<d3.PieArcDatum<PieChartData>>()
			.innerRadius(innerRadius)
			.outerRadius(outerRadius);

		// Create the SVG container
		const svg = d3
			.select(svgElement)
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Generate the pie slices
		const arcs = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

		// Draw the slices with transition
		arcs
			.append('path')
			.attr('d', arc)
			.attr('fill', (d, i) => defaultColors[i % defaultColors.length])
			.attr('stroke', 'white')
			.style('stroke-width', '2px')
			.transition()
			.duration(750)
			.attrTween('d', function (d) {
				const interpolate = d3.interpolate(
					{ startAngle: 0, endAngle: 0 },
					{ startAngle: d.startAngle, endAngle: d.endAngle }
				);
				return function (t) {
					return arc(interpolate(t) as d3.PieArcDatum<PieChartData>);
				};
			});

		// 슬라이스에 이벤트 리스너 추가 (수정된 방식)
		arcs
			.select('path')
			.on('mouseover', function (event, d) {
				// 슬라이스 강조
				d3.select(this).transition().duration(200).attr('opacity', 0.7);

				// 비율 계산
				const percentage = ((d.data.value / totalValue) * 100).toFixed(1);

				const containerRect = chartContainer.getBoundingClientRect();
				const x = event.offsetX;
				const y = event.offsetY;

				// 툴팁 표시
				d3
					.select(tooltipElement)
					.style('display', 'block')
					.style('left', `${x + 10}px`)
					.style('top', `${y + 10}px`).html(`
            <strong>${d.data.label}</strong><br>
            값: ${d.data.value.toLocaleString()}<br>
            비율: ${percentage}%
          `);
			})
			.on('mouseout', function () {
				// 슬라이스 원래대로 복원
				d3.select(this).transition().duration(200).attr('opacity', 1);

				// 툴팁 숨기기
				d3.select(tooltipElement).style('display', 'none');
			});

		// Add labels with transition
		arcs
			.append('text')
			.attr('transform', (d) => `translate(${arc.centroid(d)})`)
			.attr('text-anchor', 'middle')
			.attr('alignment-baseline', 'middle')
			.style('font-size', '12px')
			.style('opacity', 0)
			.text((d) => d.data.label)
			.transition()
			.delay(750)
			.style('opacity', 1);
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				width = entry.contentRect.width;
				height = entry.contentRect.width;
			}
		});

		resizeObserver.observe(chartContainer);

		return () => {
			resizeObserver.disconnect();
		};
	});

	// Redraw chart when data changes
	afterUpdate(drawChart);
</script>

<div bind:this={chartContainer} class="relative w-full">
	<svg bind:this={svgElement} class="w-full"></svg>
	<div
		bind:this={tooltipElement}
		class="absolute bg-[rgba(0,0,0,0.8)] text-white px-2 py-3 rounded z-10 pointer-events-none hidden"
	></div>
</div>

<style>
	svg {
		max-width: 100%;
		height: auto;
	}
</style>
