import{a as ne,e as d,t as Z,l as C,b as h,d as x,m as $,f as b,p as E,y as j,g as f,h as U,q as r,z as D,C as I,v as ee,n as S,r as M}from"../chunks/scheduler.V_dLXim4.js";import{S as ae,i as re,c as oe,d as ie,m as ue,t as ce,a as fe,e as pe}from"../chunks/index.GUsb2XqM.js";import{e as te}from"../chunks/store.0J_ACc-5.js";function le(o){let e,t="The information you entered is incorrect";return{c(){e=d("p"),e.textContent=t,this.h()},l(l){e=h(l,"P",{class:!0,"data-svelte-h":!0}),j(e)!=="svelte-11tfxh1"&&(e.textContent=t),this.h()},h(){f(e,"class","text-red-400")},m(l,n){U(l,e,n)},d(l){l&&b(e)}}}function se(o){let e,t,l,n;return{c(){e=d("label"),t=d("input"),this.h()},l(s){e=h(s,"LABEL",{});var u=x(e);t=h(u,"INPUT",{class:!0,type:!0,placeholder:!0}),u.forEach(b),this.h()},h(){f(t,"class","w-full svelte-3oyk8o"),f(t,"type","password"),f(t,"placeholder","Confirm Password")},m(s,u){U(s,e,u),r(e,t),D(t,o[2]),l||(n=I(t,"input",o[10]),l=!0)},p(s,u){u&4&&t.value!==s[2]&&D(t,s[2])},d(s){s&&b(e),l=!1,n()}}}function de(o){let e,t,l="Don't have an account?",n,s,u="Register",a,_;return{c(){e=d("div"),t=d("p"),t.textContent=l,n=C(),s=d("p"),s.textContent=u,this.h()},l(i){e=h(i,"DIV",{class:!0});var p=x(e);t=h(p,"P",{"data-svelte-h":!0}),j(t)!=="svelte-qd51yb"&&(t.textContent=l),n=E(p),s=h(p,"P",{class:!0,"data-svelte-h":!0}),j(s)!=="svelte-dksdpj"&&(s.textContent=u),p.forEach(b),this.h()},h(){f(s,"class","text-cyan-600 cursor-pointer"),f(e,"class","flex items-center gap-2 justify-center")},m(i,p){U(i,e,p),r(e,t),r(e,n),r(e,s),a||(_=[I(s,"click",o[6]),I(s,"keydown",ve)],a=!0)},p:S,d(i){i&&b(e),a=!1,M(_)}}}function he(o){let e,t,l="Already have an account?",n,s,u="Login",a,_;return{c(){e=d("div"),t=d("p"),t.textContent=l,n=C(),s=d("p"),s.textContent=u,this.h()},l(i){e=h(i,"DIV",{class:!0});var p=x(e);t=h(p,"P",{"data-svelte-h":!0}),j(t)!=="svelte-1l9vmhp"&&(t.textContent=l),n=E(p),s=h(p,"P",{class:!0,"data-svelte-h":!0}),j(s)!=="svelte-1d507mt"&&(s.textContent=u),p.forEach(b),this.h()},h(){f(s,"class","text-cyan-600 cursor-pointer"),f(e,"class","flex items-center gap-2 justify-center")},m(i,p){U(i,e,p),r(e,t),r(e,n),r(e,s),a||(_=[I(s,"click",o[6]),I(s,"keydown",_e)],a=!0)},p:S,d(i){i&&b(e),a=!1,M(_)}}}function me(o){let e,t,l=o[5]?"Register":"Login",n,s,u,a,_,i,p,T,g,B,R,P,N=o[4]?"":"Submit",V,H,w,A,G="Or",z,F,J,y=o[3]&&le(),v=o[5]&&se(o);function K(c,m){return c[5]?he:de}let q=K(o),k=q(o);return{c(){e=d("div"),t=d("h1"),n=Z(l),s=C(),y&&y.c(),u=C(),a=d("form"),_=d("label"),i=d("input"),p=C(),T=d("label"),g=d("input"),B=C(),v&&v.c(),R=C(),P=d("button"),V=Z(N),H=C(),w=d("div"),A=d("p"),A.textContent=G,z=C(),k.c(),this.h()},l(c){e=h(c,"DIV",{class:!0});var m=x(e);t=h(m,"H1",{class:!0});var Q=x(t);n=$(Q,l),Q.forEach(b),s=E(m),y&&y.l(m),u=E(m),a=h(m,"FORM",{class:!0});var L=x(a);_=h(L,"LABEL",{});var W=x(_);i=h(W,"INPUT",{class:!0,type:!0,placeholder:!0}),W.forEach(b),p=E(L),T=h(L,"LABEL",{});var X=x(T);g=h(X,"INPUT",{class:!0,type:!0,placeholder:!0}),X.forEach(b),B=E(L),v&&v.l(L),R=E(L),P=h(L,"BUTTON",{type:!0,class:!0});var Y=x(P);V=$(Y,N),Y.forEach(b),L.forEach(b),H=E(m),w=h(m,"DIV",{class:!0});var O=x(w);A=h(O,"P",{class:!0,"data-svelte-h":!0}),j(A)!=="svelte-1et5vcx"&&(A.textContent=G),z=E(O),k.l(O),O.forEach(b),m.forEach(b),this.h()},h(){f(t,"class","text-[3rem] font-bold"),f(i,"class","w-full svelte-3oyk8o"),f(i,"type","email"),f(i,"placeholder","Email"),f(g,"class","w-full svelte-3oyk8o"),f(g,"type","password"),f(g,"placeholder","Password"),f(P,"type","submit"),f(P,"class","bg-sky-900 rounded-md py-2 hover:bg-sky-600"),f(a,"class","flex flex-col gap-2 max-w-full w-[400px] mx-auto px-6 svelte-3oyk8o"),f(A,"class","option-bar svelte-3oyk8o"),f(w,"class","w-[400px] mt-2 mx-auto px-6 overflow-hidden text-sm flex flex-col gap-1 max-w-full"),f(e,"class","flex flex-col items-center justify-center flex-1")},m(c,m){U(c,e,m),r(e,t),r(t,n),r(e,s),y&&y.m(e,null),r(e,u),r(e,a),r(a,_),r(_,i),D(i,o[0]),r(a,p),r(a,T),r(T,g),D(g,o[1]),r(a,B),v&&v.m(a,null),r(a,R),r(a,P),r(P,V),r(e,H),r(e,w),r(w,A),r(w,z),k.m(w,null),F||(J=[I(i,"input",o[8]),I(g,"input",o[9]),I(P,"click",o[7])],F=!0)},p(c,[m]){m&32&&l!==(l=c[5]?"Register":"Login")&&ee(n,l),c[3]?y||(y=le(),y.c(),y.m(e,u)):y&&(y.d(1),y=null),m&1&&i.value!==c[0]&&D(i,c[0]),m&2&&g.value!==c[1]&&D(g,c[1]),c[5]?v?v.p(c,m):(v=se(c),v.c(),v.m(a,R)):v&&(v.d(1),v=null),m&16&&N!==(N=c[4]?"":"Submit")&&ee(V,N),q===(q=K(c))&&k?k.p(c,m):(k.d(1),k=q(c),k&&(k.c(),k.m(w,null)))},i:S,o:S,d(c){c&&b(e),y&&y.d(),v&&v.d(),k.d(),F=!1,M(J)}}}const _e=()=>{},ve=()=>{};function ye(o,e,t){let l="",n="",s="",u=!1,a=!1,_=!1;function i(){t(5,_=!_)}async function p(){if(!l||!n||_&&!s){t(3,u=!0);return}t(4,a=!0);try{_?await te.signup(l,n):await te.login(l,n)}catch(R){console.log("There was an auth error",R),t(3,u=!0),t(4,a=!1)}}function T(){l=this.value,t(0,l)}function g(){n=this.value,t(1,n)}function B(){s=this.value,t(2,s)}return[l,n,s,u,a,_,i,p,T,g,B]}class be extends ae{constructor(e){super(),re(this,e,ye,me,ne,{})}}function ge(o){let e,t;return e=new be({}),{c(){oe(e.$$.fragment)},l(l){ie(e.$$.fragment,l)},m(l,n){ue(e,l,n),t=!0},p:S,i(l){t||(ce(e.$$.fragment,l),t=!0)},o(l){fe(e.$$.fragment,l),t=!1},d(l){pe(e,l)}}}class Ce extends ae{constructor(e){super(),re(this,e,null,ge,ne,{})}}export{Ce as component};
