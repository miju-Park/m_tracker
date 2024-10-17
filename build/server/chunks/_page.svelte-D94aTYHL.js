import { c as create_ssr_component, a as subscribe, v as validate_component, d as each, e as escape, b as add_attribute } from './ssr-8qQtB6gu.js';
import './client-BUusD8wq.js';
import { a as authStore, L as Label, I as Input, R as Root, T as Trigger, P as Popover_content, C as Calculator } from './Calculator-CzHd-q4s.js';
import './firebase-BKeGrI0b.js';
import './exports-BGi7-Rnc.js';
import 'firebase/auth';
import './index-C6mxKevJ.js';
import 'dayjs';
import 'firebase/firestore';
import 'clsx';
import '@internationalized/date';
import 'tailwind-merge';
import 'firebase/app';

const css = {
  code: "form.svelte-gjewix{display:flex;flex-direction:column;gap:1rem;max-width:400px;margin:0 auto}label.svelte-gjewix{font-weight:bold}select.svelte-gjewix,textarea.svelte-gjewix{width:100%;padding:0.5rem}button.svelte-gjewix{padding:0.5rem 1rem;background-color:#4caf50;color:white;border:none;cursor:pointer}button.svelte-gjewix:hover{background-color:#45a049}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { fly } from \\"svelte/transition\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport { Label } from \\"@/components/ui/label\\";\\nimport { Input } from \\"@/components/ui/input\\";\\nimport { Content, Popover, Root, Trigger } from \\"@/components/ui/popover\\";\\nimport Calculator from \\"../../components/Calculator.svelte\\";\\nimport { auth } from \\"@/firebase/firebase\\";\\nimport { authStore } from \\"../../store/store\\";\\nimport { transactionHandlers } from \\"../../store/transaction\\";\\nlet popoverIsOpen = false;\\nlet description = \\"\\";\\nlet date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);\\nlet amount = \\"\\";\\nlet type = \\"expense\\";\\nlet category = \\"\\";\\nlet memo = \\"\\";\\nconst categories = [\\"\\\\uC2DD\\\\uBE44\\", \\"\\\\uAD50\\\\uD1B5\\", \\"\\\\uC8FC\\\\uAC70\\", \\"\\\\uC758\\\\uB8CC\\", \\"\\\\uAD50\\\\uC721\\", \\"\\\\uC5EC\\\\uAC00\\", \\"\\\\uAE30\\\\uD0C0\\"];\\nasync function handleSubmit() {\\n  const userId = $authStore.user?.uid;\\n  if (userId) {\\n    const transaction = {\\n      description,\\n      date: new Date(date),\\n      amount: Number(amount),\\n      type,\\n      category,\\n      memo,\\n      userId\\n    };\\n    await transactionHandlers.add(transaction);\\n    goto(\\"/dashboard\\");\\n  }\\n}\\nfunction handleAmountSubmit(event) {\\n  amount = event.detail.amount.toLocaleString();\\n  popoverIsOpen = false;\\n}\\n<\/script>\\n\\n<div in:fly={{ y: 200, duration: 500 }}>\\n\\t<h1>가계부 입력</h1>\\n\\n\\t<form on:submit|preventDefault={handleSubmit}>\\n\\t\\t<div class=\\"flex w-full max-w-sm flex-col gap-1.5\\">\\n\\t\\t\\t<Label for=\\"description\\">내역</Label>\\n\\t\\t\\t<Input id=\\"description\\" placeholder=\\"내역\\" bind:value={description} style=\\"width: 100%;\\" />\\n\\t\\t</div>\\n\\n\\t\\t<div class=\\"flex w-full justify-start max-w-sm flex-col gap-1.5\\">\\n\\t\\t\\t<Input type=\\"date\\" bind:value={date} />\\n\\t\\t</div>\\n\\n\\t\\t<Root portal={null} bind:open={popoverIsOpen}>\\n\\t\\t\\t<Trigger>\\n\\t\\t\\t\\t<div>\\n\\t\\t\\t\\t\\t<Label for=\\"amount\\">금액</Label>\\n\\t\\t\\t\\t\\t<Input id=\\"amount\\" style=\\"width: 100%;\\" bind:value={amount} />\\n\\t\\t\\t\\t</div>\\n\\t\\t\\t</Trigger>\\n\\t\\t\\t<Content class=\\"w-80\\">\\n\\t\\t\\t\\t<Calculator on:submit={handleAmountSubmit} />\\n\\t\\t\\t</Content>\\n\\t\\t</Root>\\n\\n\\t\\t<div>\\n\\t\\t\\t<label for=\\"type\\">타입:</label>\\n\\t\\t\\t<select id=\\"type\\" bind:value={type}>\\n\\t\\t\\t\\t<option value=\\"expense\\">지출</option>\\n\\t\\t\\t\\t<option value=\\"income\\">수입</option>\\n\\t\\t\\t</select>\\n\\t\\t</div>\\n\\n\\t\\t<div>\\n\\t\\t\\t<label for=\\"category\\">카테고리:</label>\\n\\t\\t\\t<select id=\\"category\\" bind:value={category} required>\\n\\t\\t\\t\\t<option value=\\"\\">선택하세요</option>\\n\\t\\t\\t\\t{#each categories as cat}\\n\\t\\t\\t\\t\\t<option value={cat}>{cat}</option>\\n\\t\\t\\t\\t{/each}\\n\\t\\t\\t</select>\\n\\t\\t</div>\\n\\n\\t\\t<div>\\n\\t\\t\\t<label for=\\"memo\\">메모:</label>\\n\\t\\t\\t<textarea id=\\"memo\\" bind:value={memo}></textarea>\\n\\t\\t</div>\\n\\n\\t\\t<button type=\\"submit\\">저장</button>\\n\\t</form>\\n</div>\\n\\n<style>\\n\\tform {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tgap: 1rem;\\n\\t\\tmax-width: 400px;\\n\\t\\tmargin: 0 auto;\\n\\t}\\n\\n\\tlabel {\\n\\t\\tfont-weight: bold;\\n\\t}\\n\\n\\tinput,\\n\\tselect,\\n\\ttextarea {\\n\\t\\twidth: 100%;\\n\\t\\tpadding: 0.5rem;\\n\\t}\\n\\n\\tbutton {\\n\\t\\tpadding: 0.5rem 1rem;\\n\\t\\tbackground-color: #4caf50;\\n\\t\\tcolor: white;\\n\\t\\tborder: none;\\n\\t\\tcursor: pointer;\\n\\t}\\n\\n\\tbutton:hover {\\n\\t\\tbackground-color: #45a049;\\n\\t}\\n</style>\\n"],"names":[],"mappings":"AA4FC,kBAAK,CACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,CACT,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,IACX,CAEA,mBAAM,CACL,WAAW,CAAE,IACd,CAGA,oBAAM,CACN,sBAAS,CACR,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,MACV,CAEA,oBAAO,CACN,OAAO,CAAE,MAAM,CAAC,IAAI,CACpB,gBAAgB,CAAE,OAAO,CACzB,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CACZ,MAAM,CAAE,OACT,CAEA,oBAAM,MAAO,CACZ,gBAAgB,CAAE,OACnB"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authStore;
  $$unsubscribe_authStore = subscribe(authStore, (value) => value);
  let popoverIsOpen = false;
  let description = "";
  let date = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  let amount = "";
  const categories = [
    "식비",
    "교통",
    "주거",
    "의료",
    "교육",
    "여가",
    "기타"
  ];
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div><h1 data-svelte-h="svelte-1rnnumu">가계부 입력</h1> <form class="svelte-gjewix"><div class="flex w-full max-w-sm flex-col gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "description" }, {}, {
      default: () => {
        return `내역`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        id: "description",
        placeholder: "내역",
        style: "width: 100%;",
        value: description
      },
      {
        value: ($$value) => {
          description = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="flex w-full justify-start max-w-sm flex-col gap-1.5">${validate_component(Input, "Input").$$render(
      $$result,
      { type: "date", value: date },
      {
        value: ($$value) => {
          date = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${validate_component(Root, "Root").$$render(
      $$result,
      { portal: null, open: popoverIsOpen },
      {
        open: ($$value) => {
          popoverIsOpen = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Trigger, "Trigger").$$render($$result, {}, {}, {
            default: () => {
              return `<div>${validate_component(Label, "Label").$$render($$result, { for: "amount" }, {}, {
                default: () => {
                  return `금액`;
                }
              })} ${validate_component(Input, "Input").$$render(
                $$result,
                {
                  id: "amount",
                  style: "width: 100%;",
                  value: amount
                },
                {
                  value: ($$value) => {
                    amount = $$value;
                    $$settled = false;
                  }
                },
                {}
              )}</div>`;
            }
          })} ${validate_component(Popover_content, "Content").$$render($$result, { class: "w-80" }, {}, {
            default: () => {
              return `${validate_component(Calculator, "Calculator").$$render($$result, {}, {}, {})}`;
            }
          })}`;
        }
      }
    )} <div><label for="type" class="svelte-gjewix" data-svelte-h="svelte-age7rv">타입:</label> <select id="type" class="svelte-gjewix"><option value="expense" data-svelte-h="svelte-10kd8a0">지출</option><option value="income" data-svelte-h="svelte-1j8c372">수입</option></select></div> <div><label for="category" class="svelte-gjewix" data-svelte-h="svelte-1vvwpg4">카테고리:</label> <select id="category" required class="svelte-gjewix"><option value="" data-svelte-h="svelte-394l5h">선택하세요</option>${each(categories, (cat) => {
      return `<option${add_attribute("value", cat, 0)}>${escape(cat)}</option>`;
    })}</select></div> <div><label for="memo" class="svelte-gjewix" data-svelte-h="svelte-7dajn2">메모:</label> <textarea id="memo" class="svelte-gjewix">${escape("")}</textarea></div> <button type="submit" class="svelte-gjewix" data-svelte-h="svelte-1csp8k4">저장</button></form> </div>`;
  } while (!$$settled);
  $$unsubscribe_authStore();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-D94aTYHL.js.map
