(self.webpackChunk=self.webpackChunk||[]).push([[77],{9077:(e,t,l)=>{l.r(t),l.d(t,{default:()=>U});var a=l(6252),o=l(3577),n=l(7254),i=l(7876),u=l(2262),s=l(8676);const r=100,d=20;function v(e){return(e<0?-1:1)*Math.sqrt(Math.abs(e))*1.41421356237}function c(e){if(e.length<2)return 0;if(2===e.length)return e[1].t===e[0].t?0:(e[1].d-e[0].d)/(e[1].t-e[0].t);let t=0;for(let l=e.length-1;l>0;l--){if(e[l].t===e[l-1].t)continue;const a=v(t),o=(e[l].d-e[l-1].d)/(e[l].t-e[l-1].t);t+=(o-a)*Math.abs(o),l===e.length-1&&(t*=.5)}return 1e3*v(t)}function m(){const e={};return{addMovement:function(t){Array.from(t.changedTouches).forEach((l=>{(e[l.identifier]??(e[l.identifier]=new s.PU(d))).push([t.timeStamp,l])}))},endTouch:function(t){Array.from(t.changedTouches).forEach((t=>{delete e[t.identifier]}))},getVelocity:function(t){const l=e[t]?.values().reverse();if(!l)throw new Error(`No samples for touch id ${t}`);const a=l[0],o=[],n=[];for(const e of l){if(a[0]-e[0]>r)break;o.push({t:e[0],d:e[1].clientX}),n.push({t:e[0],d:e[1].clientY})}return{x:c(o),y:c(n),get direction(){const{x:e,y:t}=this,[l,a]=[Math.abs(e),Math.abs(t)];return l>a&&e>=0?"right":l>a&&e<=0?"left":a>l&&t>=0?"down":a>l&&t<=0?"up":function(){throw new Error}()}}}}}function p(){throw new Error}var h=l(9757),g=l(6454),f=l(6054),w=l(9e3),y=l(3421),b=l(5455),k=l(6947),W=l(4552),S=l(1316),V=l(8247),_=l(3664),B=l(9084),C=l(2902),E=l(2716),x=l(195),L=l(9963),F=l(6533),M=l(6719),P=l(6150),T=l(3099);const Y=["start","end","left","right","top","bottom"],I=(0,F.U)({color:String,disableResizeWatcher:Boolean,disableRouteWatcher:Boolean,expandOnHover:Boolean,floating:Boolean,modelValue:{type:Boolean,default:null},permanent:Boolean,rail:{type:Boolean,default:null},railWidth:{type:[Number,String],default:56},scrim:{type:[Boolean,String],default:!0},image:String,temporary:Boolean,touchless:Boolean,width:{type:[Number,String],default:256},location:{type:String,default:"start",validator:e=>Y.includes(e)},sticky:Boolean,...(0,g.m)(),...(0,w.l)(),...(0,k.c)(),...(0,W.o8)(),...(0,V.I)(),...(0,E.Q)({tag:"nav"}),...(0,x.x$)()},"VNavigationDrawer"),A=(0,M.ev)()({name:"VNavigationDrawer",props:I(),emits:{"update:modelValue":e=>!0,"update:rail":e=>!0},setup(e,t){let{attrs:l,emit:o,slots:n}=t;const{isRtl:i}=(0,h.Vw)(),{themeClasses:r}=(0,x.ER)(e),{borderClasses:d}=(0,g.P)(e),{backgroundColorClasses:v,backgroundColorStyles:c}=(0,f.Y5)((0,u.Vh)(e,"color")),{elevationClasses:w}=(0,k.Y)(e),{mobile:E}=(0,b.AW)(),{roundedClasses:F}=(0,V.b)(e),M=(0,_.tv)(),Y=(0,S.z)(e,"modelValue",null,(e=>!!e)),{ssrBootStyles:I}=(0,C.u)(),{scopeId:A}=(0,B.a)(),H=(0,u.iH)(),X=(0,u.XI)(!1),$=(0,a.Fl)((()=>e.rail&&e.expandOnHover&&X.value?Number(e.width):Number(e.rail?e.railWidth:e.width))),U=(0,a.Fl)((()=>(0,P.Wc)(e.location,i.value))),R=(0,a.Fl)((()=>!e.permanent&&(E.value||e.temporary))),N=(0,a.Fl)((()=>e.sticky&&!R.value&&"bottom"!==U.value));e.expandOnHover&&null!=e.rail&&(0,a.YP)(X,(e=>o("update:rail",!e))),e.disableResizeWatcher||(0,a.YP)(R,(t=>!e.permanent&&(0,a.Y3)((()=>Y.value=!t)))),!e.disableRouteWatcher&&M&&(0,a.YP)(M.currentRoute,(()=>R.value&&(Y.value=!1))),(0,a.YP)((()=>e.permanent),(e=>{e&&(Y.value=!0)})),(0,a.wF)((()=>{null!=e.modelValue||R.value||(Y.value=e.permanent||!E.value)}));const{isDragging:z,dragProgress:D,dragStyles:q}=function(e){let{isActive:t,isTemporary:l,width:o,touchless:n,position:i}=e;(0,a.bv)((()=>{window.addEventListener("touchstart",k,{passive:!0}),window.addEventListener("touchmove",W,{passive:!1}),window.addEventListener("touchend",S,{passive:!0})})),(0,a.Jd)((()=>{window.removeEventListener("touchstart",k),window.removeEventListener("touchmove",W),window.removeEventListener("touchend",S)}));const s=(0,a.Fl)((()=>["left","right"].includes(i.value))),{addMovement:r,endTouch:d,getVelocity:v}=m();let c=!1;const h=(0,u.XI)(!1),g=(0,u.XI)(0),f=(0,u.XI)(0);let w;function y(e,t){return("left"===i.value?e:"right"===i.value?document.documentElement.clientWidth-e:"top"===i.value?e:"bottom"===i.value?document.documentElement.clientHeight-e:p())-(t?o.value:0)}function b(e){let t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];const l="left"===i.value?(e-f.value)/o.value:"right"===i.value?(document.documentElement.clientWidth-e-f.value)/o.value:"top"===i.value?(e-f.value)/o.value:"bottom"===i.value?(document.documentElement.clientHeight-e-f.value)/o.value:p();return t?Math.max(0,Math.min(1,l)):l}function k(e){if(n.value)return;const a=e.changedTouches[0].clientX,u=e.changedTouches[0].clientY,v="left"===i.value?a<25:"right"===i.value?a>document.documentElement.clientWidth-25:"top"===i.value?u<25:"bottom"===i.value?u>document.documentElement.clientHeight-25:p(),m=t.value&&("left"===i.value?a<o.value:"right"===i.value?a>document.documentElement.clientWidth-o.value:"top"===i.value?u<o.value:"bottom"===i.value?u>document.documentElement.clientHeight-o.value:p());(v||m||t.value&&l.value)&&(c=!0,w=[a,u],f.value=y(s.value?a:u,t.value),g.value=b(s.value?a:u),d(e),r(e))}function W(e){const t=e.changedTouches[0].clientX,l=e.changedTouches[0].clientY;if(c){if(!e.cancelable)return void(c=!1);const a=Math.abs(t-w[0]),o=Math.abs(l-w[1]);(s.value?a>o&&a>3:o>a&&o>3)?(h.value=!0,c=!1):(s.value?o:a)>3&&(c=!1)}if(!h.value)return;e.preventDefault(),r(e);const a=b(s.value?t:l,!1);g.value=Math.max(0,Math.min(1,a)),a>1?f.value=y(s.value?t:l,!0):a<0&&(f.value=y(s.value?t:l,!1))}function S(e){if(c=!1,!h.value)return;r(e),h.value=!1;const l=v(e.changedTouches[0].identifier),a=Math.abs(l.x),o=Math.abs(l.y),n=s.value?a>o&&a>400:o>a&&o>3;t.value=n?l.direction===({left:"right",right:"left",top:"down",bottom:"up"}[i.value]||p()):g.value>.5}const V=(0,a.Fl)((()=>h.value?{transform:"left"===i.value?`translateX(calc(-100% + ${g.value*o.value}px))`:"right"===i.value?`translateX(calc(100% - ${g.value*o.value}px))`:"top"===i.value?`translateY(calc(-100% + ${g.value*o.value}px))`:"bottom"===i.value?`translateY(calc(100% - ${g.value*o.value}px))`:p(),transition:"none"}:void 0));return{isDragging:h,dragProgress:g,dragStyles:V}}({isActive:Y,isTemporary:R,width:$,touchless:(0,u.Vh)(e,"touchless"),position:U}),O=(0,a.Fl)((()=>{const t=R.value?0:e.rail&&e.expandOnHover?Number(e.railWidth):$.value;return z.value?t*D.value:t})),{layoutItemStyles:j,layoutItemScrimStyles:K}=(0,W.eW)({id:e.name,order:(0,a.Fl)((()=>parseInt(e.order,10))),position:U,layoutSize:O,elementSize:$,active:(0,a.Fl)((()=>Y.value||z.value)),disableTransitions:(0,a.Fl)((()=>z.value)),absolute:(0,a.Fl)((()=>e.absolute||N.value&&"string"!=typeof Z.value))}),{isStuck:Z,stickyStyles:G}=function(e){let{rootEl:t,isSticky:l,layoutItemStyles:o}=e;const n=(0,u.XI)(!1),i=(0,u.XI)(0),r=(0,a.Fl)((()=>{const e="boolean"==typeof n.value?"top":n.value;return[l.value?{top:"auto",bottom:"auto",height:void 0}:void 0,n.value?{[e]:(0,s.kb)(i.value)}:{top:o.value.top}]}));(0,a.bv)((()=>{(0,a.YP)(l,(e=>{e?window.addEventListener("scroll",v,{passive:!0}):window.removeEventListener("scroll",v)}),{immediate:!0})})),(0,a.Jd)((()=>{window.removeEventListener("scroll",v)}));let d=0;function v(){const e=d>window.scrollY?"up":"down",l=t.value.getBoundingClientRect(),a=parseFloat(o.value.top??0),u=window.scrollY-Math.max(0,i.value-a),s=l.height+Math.max(i.value,a)-window.scrollY-window.innerHeight,r=parseFloat(getComputedStyle(t.value).getPropertyValue("--v-body-scroll-y"))||0;l.height<window.innerHeight-a?(n.value="top",i.value=a):"up"===e&&"bottom"===n.value||"down"===e&&"top"===n.value?(i.value=window.scrollY+l.top-r,n.value=!0):"down"===e&&s<=0?(i.value=0,n.value="bottom"):"up"===e&&u<=0&&(r?"top"!==n.value&&(i.value=-u+r+a,n.value="top"):(i.value=l.top+u,n.value="top")),d=window.scrollY}return{isStuck:n,stickyStyles:r}}({rootEl:H,isSticky:N,layoutItemStyles:j}),J=(0,f.Y5)((0,a.Fl)((()=>"string"==typeof e.scrim?e.scrim:null))),Q=(0,a.Fl)((()=>({...z.value?{opacity:.2*D.value,transition:"none"}:void 0,...K.value})));function ee(){X.value=!0}function te(){X.value=!1}return(0,y.AF)({VList:{bgColor:"transparent"}}),(0,T.L)((()=>{const t=n.image||e.image;return(0,a.Wm)(a.HY,null,[(0,a.Wm)(e.tag,(0,a.dG)({ref:H,onMouseenter:ee,onMouseleave:te,class:["v-navigation-drawer",`v-navigation-drawer--${U.value}`,{"v-navigation-drawer--expand-on-hover":e.expandOnHover,"v-navigation-drawer--floating":e.floating,"v-navigation-drawer--is-hovering":X.value,"v-navigation-drawer--rail":e.rail,"v-navigation-drawer--temporary":R.value,"v-navigation-drawer--active":Y.value,"v-navigation-drawer--sticky":N.value},r.value,v.value,d.value,w.value,F.value,e.class],style:[c.value,j.value,q.value,I.value,G.value,e.style]},A,l),{default:()=>[t&&(0,a.Wm)("div",{key:"image",class:"v-navigation-drawer__img"},[n.image?n.image?.({image:e.image}):(0,a.Wm)("img",{src:e.image,alt:""},null)]),n.prepend&&(0,a.Wm)("div",{class:"v-navigation-drawer__prepend"},[n.prepend?.()]),(0,a.Wm)("div",{class:"v-navigation-drawer__content"},[n.default?.()]),n.append&&(0,a.Wm)("div",{class:"v-navigation-drawer__append"},[n.append?.()])]}),(0,a.Wm)(L.uT,{name:"fade-transition"},{default:()=>[R.value&&(z.value||Y.value)&&!!e.scrim&&(0,a.Wm)("div",(0,a.dG)({class:["v-navigation-drawer__scrim",J.backgroundColorClasses.value],style:[Q.value,J.backgroundColorStyles.value],onClick:()=>Y.value=!1},A),null)]})])})),{isStuck:Z}}});var H=l(5317);const X=a.aZ({components:{},props:{modelValue:{type:Boolean}},setup:(e,t)=>({isOpen:e.modelValue,mdiWifiSync:H.WqO,mdiXml:H.SMx,mdiBackupRestore:H.EeS,mdiCog:H.Shd})});const $={$style:{sideBarContent:"J0C635R9kZMHkFi_jPJ3"}},U=(0,l(3744).Z)(X,[["render",function(e,t,l,u,s,r){return(0,a.wg)(),(0,a.j4)(A,{modelValue:e.modelValue,order:-1,"onUpdate:modelValue":t[3]||(t[3]=t=>e.$emit("update:modelValue",t))},{default:(0,a.w5)((()=>[(0,a._)("div",{class:(0,o.C_)([e.$style.sideBarContent,"d-flex flex-column h-100"])},[(0,a.Wm)(n.i,{nav:""},{default:(0,a.w5)((()=>[(0,a.Wm)(i.l,{onClick:t[0]||(t[0]=()=>{}),"prepend-icon":e.mdiWifiSync,title:"Local sync"},null,8,["prepend-icon"]),(0,a.Wm)(i.l,{onClick:t[1]||(t[1]=()=>{}),"prepend-icon":e.mdiBackupRestore,title:"Import & Backup"},null,8,["prepend-icon"]),(0,a.Wm)(i.l,{to:{name:"9436"},"prepend-icon":e.mdiCog,title:"Settings"},null,8,["to","prepend-icon"])])),_:1}),(0,a.Wm)(n.i,{nav:"",class:"mt-auto"},{default:(0,a.w5)((()=>[(0,a.Wm)(i.l,{onClick:t[2]||(t[2]=t=>e.window.open("https://github.com/Heniker/web-2fa","_blank")),"prepend-icon":e.mdiXml,title:"Source Code"},null,8,["prepend-icon"])])),_:1})],2)])),_:1},8,["modelValue"])}],["__cssModules",$],["__scopeId","data-v-7f645124"]])},9436:(e,t,l)=>{l.r(t),l.d(t,{default:()=>E});var a=l(6252),o=l(3577),n=l(5934),i=l(7695),u=l(5911),s=l(9357),r=l(7767),d=l(2138),v=l(2335),c=l(4246),m=l(2246),p=l(1198),h=l(1316),g=l(2262),f=l(6533),w=l(6719),y=l(4083),b=l(3099),k=l(8676);const W=(0,f.U)({indeterminate:Boolean,inset:Boolean,flat:Boolean,loading:{type:[Boolean,String],default:!1},...(0,d.c)(),...(0,c.UZ)()},"VSwitch"),S=(0,w.ev)()({name:"VSwitch",inheritAttrs:!1,props:W(),emits:{"update:focused":e=>!0,"update:modelValue":()=>!0,"update:indeterminate":e=>!0},setup(e,t){let{attrs:l,slots:o}=t;const n=(0,h.z)(e,"indeterminate"),i=(0,h.z)(e,"modelValue"),{loaderClasses:u}=(0,p.U2)(e),{isFocused:s,focus:r,blur:f}=(0,m.K)(e),w=(0,a.Fl)((()=>"string"==typeof e.loading&&""!==e.loading?e.loading:e.color)),W=(0,y.sq)(),S=(0,a.Fl)((()=>e.id||`switch-${W}`));function V(){n.value&&(n.value=!1)}return(0,b.L)((()=>{const[t,m]=(0,k.An)(l),[h,y]=d.q.filterProps(e),[b,W]=c.g5.filterProps(e),_=(0,g.iH)();function B(e){e.stopPropagation(),e.preventDefault(),_.value?.input?.click()}return(0,a.Wm)(d.q,(0,a.dG)({class:["v-switch",{"v-switch--inset":e.inset},{"v-switch--indeterminate":n.value},u.value,e.class],style:e.style},t,h,{id:S.value,focused:s.value}),{...o,default:t=>{let{id:l,messagesId:u,isDisabled:s,isReadonly:d,isValid:h}=t;return(0,a.Wm)(c.g5,(0,a.dG)({ref:_},b,{modelValue:i.value,"onUpdate:modelValue":[e=>i.value=e,V],id:l.value,"aria-describedby":u.value,type:"checkbox","aria-checked":n.value?"mixed":void 0,disabled:s.value,readonly:d.value,onFocus:r,onBlur:f},m),{...o,default:()=>(0,a.Wm)("div",{class:"v-switch__track",onClick:B},null),input:t=>{let{textColorClasses:l,textColorStyles:n}=t;return(0,a.Wm)("div",{class:["v-switch__thumb",l.value],style:n.value},[e.loading&&(0,a.Wm)(p.rD,{name:"v-switch",active:!0,color:!1===h.value?void 0:w.value},{default:e=>o.loader?o.loader(e):(0,a.Wm)(v.L,{active:e.isActive,color:e.color,indeterminate:!0,size:"16",width:"2"},null)})])}})}})})),{}}});var V=l(3258);var _=l(9166);const B=a.aZ({components:{},setup(e,t){const l=a.f3(_.Settings.token);assert(l);return{appLockTime:{selected:g.BK(l.reactive).passwordKeepAlive,options:[{title:"Instant",value:0},{title:"1 minute",value:6e4},{title:"5 minutes",value:3e5},{title:"10 minutes",value:6e5},{title:"30 minutes",value:18e5},{title:"1 hour",value:36e5},{title:"12 hours",value:432e5},{title:"Never",value:1/0}]},appTheme:{selected:g.BK(l.reactive).theme,options:l.themeValues.map((e=>({title:e.slice(0,1).toUpperCase()+e.slice(1),value:e})))},appProgressBar:{selected:g.BK(l.reactive).progressBarStyle,options:l.progressBarValues.map((e=>({title:e.slice(0,1).toUpperCase()+e.slice(1),value:e})))},preferLessAnimations:g.BK(l.reactive).preferLessAnimations}}});const C={$style:{switch:"lAopPkcwzK6vEXIGjNX9",scrim:"Zghq6gOw53mblW_9BkGJ DqjoKPvNkfPE92sGTz0p"}},E=(0,l(3744).Z)(B,[["render",function(e,t,l,d,v,c){return(0,a.wg)(),(0,a.j4)(a.lR,{to:"#app-overlay-portal"},[(0,a._)("section",{class:(0,o.C_)([e.$style.scrim,"d-flex justify-center align-center"])},[(0,a.wy)(((0,a.wg)(),(0,a.j4)(n._,{width:e.display.smAndDown?"90vw":400,class:"pb-2"},{default:(0,a.w5)((()=>[(0,a.Wm)(i.E,{class:"d-flex justify-center mt-3 mb-1 text-h4"},{default:(0,a.w5)((()=>[(0,a.Uk)("Settings")])),_:1}),(0,a.Wm)(u.Z,{class:"pb-2"},{default:(0,a.w5)((()=>[(0,a.Wm)(s.O,null,{default:(0,a.w5)((()=>[(0,a.Wm)(r.rL,{modelValue:e.appTheme.selected.value,"onUpdate:modelValue":t[0]||(t[0]=t=>e.appTheme.selected.value=t),items:e.appTheme.options,class:"mt-3",label:"Theme",variant:"solo-filled","hide-details":""},null,8,["modelValue","items"]),(0,a.Wm)(r.rL,{modelValue:e.appLockTime.selected.value,"onUpdate:modelValue":t[1]||(t[1]=t=>e.appLockTime.selected.value=t),items:e.appLockTime.options,class:"mt-3",label:"Lock after",variant:"solo-filled","hide-details":""},null,8,["modelValue","items"]),(0,a.Wm)(r.rL,{modelValue:e.appProgressBar.selected.value,"onUpdate:modelValue":t[2]||(t[2]=t=>e.appProgressBar.selected.value=t),items:e.appProgressBar.options,class:"mt-3",label:"Progress bar style",variant:"solo-filled","hide-details":""},null,8,["modelValue","items"]),(0,a.kq)(' v-model="s" '),(0,a.Wm)(S,{modelValue:e.preferLessAnimations,"onUpdate:modelValue":t[3]||(t[3]=t=>e.preferLessAnimations=t),class:(0,o.C_)([e.$style.switch,"mt-3"]),color:"deep-purple-lighten-2",label:"Prefer less animations","hide-details":""},null,8,["modelValue","class"])])),_:1})])),_:1})])),_:1},8,["width"])),[[V.L,{include:()=>[...e.window.document.querySelectorAll(".v-select__content")],handler:()=>e.$router.push({name:"9648"})}]])],2)])}],["__cssModules",C]])}}]);
//# sourceMappingURL=77.9b6b8210f0851441b355.bundle.js.map