import{a as p,c as b,e as S,b as $,d as v,f as d,g as w,h as y,u as A,j as C,k as D,o as E}from"../chunks/scheduler.V_dLXim4.js";import{S as P,i as R,t as T,a as j}from"../chunks/index.GUsb2XqM.js";import{g as h}from"../chunks/entry.Cs_RBm1p.js";import{a as k,d as m,b as _,g as q,s as x,c as F}from"../chunks/store.0J_ACc-5.js";function I(r){let a,o;const l=r[1].default,e=b(l,r,r[0],null);return{c(){a=S("div"),e&&e.c(),this.h()},l(t){a=$(t,"DIV",{class:!0});var s=v(a);e&&e.l(s),s.forEach(d),this.h()},h(){w(a,"class","min-h-screen bg-gradient-to-r from-[#000428] to-[#000046] text-white flex flex-col relative")},m(t,s){y(t,a,s),e&&e.m(a,null),o=!0},p(t,[s]){e&&e.p&&(!o||s&1)&&A(e,l,t,t[0],o?D(l,t[0],s,null):C(t[0]),null)},i(t){o||(T(e,t),o=!0)},o(t){j(e,t),o=!1},d(t){t&&d(a),e&&e.d(t)}}}function L(r,a,o){let{$$slots:l={},$$scope:e}=a;const t=["/"];return E(()=>k.onAuthStateChanged(async n=>{const u=window.location.pathname;if(!n&&!t.includes(u)){h("/");return}if(n)try{let i=null;const g=m(_,"users",n.uid),f=await q(g);if(f.exists())console.log("Fetching User"),i=f.data();else{console.log("create user");const c=m(_,"users",n.uid);i={email:n.email||""},await x(c,i,{merge:!0})}if(F.update(c=>({...c,user:n,loading:!1,data:i})),n&&u==="/"){h("/dashboard");return}}catch(i){console.error("Error in onAuthStateChanged:",i)}})),r.$$set=s=>{"$$scope"in s&&o(0,e=s.$$scope)},[e,l]}class B extends P{constructor(a){super(),R(this,a,L,I,p,{})}}export{B as component};
