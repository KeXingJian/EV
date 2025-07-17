<script setup>
import emitter from "../../../emitter/emitter.js";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const email = '2787901285@qq.com'

const appreciate1 = ()=>{
  emitter.emit("appreciate1")
}

const appreciate2 = ()=>{
  emitter.emit("appreciate2")
}

const toShowPolicy = ()=>{
  emitter.emit("show-policy")
}

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(email)
    emitter.emit("toast", t('copy'))
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<template>
  <div class="top-div footer">
    <div class="footer-container">

      <div class="footer-glass">
        <div class="footer-grid">
          <div class="footer-section">
            <h1>EV</h1>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">{{ $t('contact') }}</h4>
            <ul class="footer-links">
              <li class="social-icons">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M597.172 531.547c-9.668-9.857-9.514-25.686 0.344-35.353 9.857-9.668 25.686-9.514 35.353 0.343L941.85 811.58c9.667 9.858 9.514 25.686-0.344 35.354-9.857 9.668-25.686 9.514-35.354-0.343L597.172 531.547zM117.85 846.59c-9.668 9.857-25.497 10.01-35.354 0.343-9.858-9.668-10.011-25.496-0.344-35.354l308.98-315.042c9.667-9.857 25.496-10.011 35.353-0.343 9.858 9.667 10.012 25.496 0.344 35.353L117.848 846.59z"
                      fill="#85A5FF"/>
                  <path
                      d="M82.151 216.505c-9.667-9.857-9.514-25.686 0.344-35.354 9.857-9.667 25.686-9.514 35.354 0.344l340.605 347.29c29.004 29.572 76.489 30.033 106.061 1.03 0.347-0.34 0.69-0.684 1.03-1.03l340.606-347.29c9.668-9.858 25.497-10.011 35.354-0.344 9.858 9.668 10.011 25.497 0.344 35.354l-340.606 347.29a125 125 0 0 1-1.718 1.717c-49.287 48.339-128.429 47.57-176.768-1.718L82.151 216.505z"
                      fill="#2F54EB"/>
                  <path
                      d="M95 191v643h835V191H95z m0-60h835c33.137 0 60 26.863 60 60v643c0 33.137-26.863 60-60 60H95c-33.137 0-60-26.863-60-60V191c0-33.137 26.863-60 60-60z"
                      fill="#2F54EB"/>
                </svg>
                <a class="footer-link" @click="copyEmail">{{ $t('email') }}</a>
              </li>
              <li class="social-icons">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill="#d81e06"
                        d="M426.666667 682.666667V384l256 149.845333L426.666667 682.666667z m587.093333-355.541334s-10.026667-71.04-40.704-102.357333c-38.954667-41.088-82.602667-41.258667-102.613333-43.648C727.168 170.666667 512.213333 170.666667 512.213333 170.666667h-0.426666s-214.954667 0-358.229334 10.453333c-20.053333 2.389333-63.658667 2.56-102.656 43.648-30.677333 31.317333-40.661333 102.4-40.661333 102.4S0 410.538667 0 493.952v78.293333c0 83.456 10.24 166.912 10.24 166.912s9.984 71.04 40.661333 102.357334c38.997333 41.088 90.154667 39.765333 112.938667 44.074666C245.76 893.568 512 896 512 896s215.168-0.341333 358.442667-10.752c20.053333-2.432 63.658667-2.602667 102.613333-43.690667 30.72-31.317333 40.704-102.4 40.704-102.4s10.24-83.413333 10.24-166.869333v-78.250667c0-83.456-10.24-166.912-10.24-166.912z"/>
                </svg>
                <a href="https://youtube.com/@kxj-u6p4p?si=0rJvf4IJv_4WZNnA" target="_blank" rel="noopener" class="footer-link">youtube</a>
              </li>
              <li class="social-icons">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill="#d4237a"
                        d="M129.36 208c131.28-4.88 760.4 0 760.4 0s122.88 25.6 126.16 160.4c-1.6 134.8 0 404.16 0 404.16s-6.8 131.6-124.56 152.48c-50.48-1.68-67.2 0-67.2 0s-3.36 55.36-52.96 56.16c-49.76 0.72-57.2-38.56-58.88-52.96-28.48 0-352.88 1.44-390.16 1.6h-3.52s-6 51.36-55.6 51.36c-49.76 0-52.16-42.56-55.52-51.28-32 0-75.68-0.8-75.68-0.8s-109.6-21.6-123.76-157.2c1.84-130.4 0.24-383.12 0.08-402.32v-1.28C7.84 362.88 1.04 242.56 129.36 208z m745.92 98.4H158.96c-21.76 0-39.44 17.28-39.44 38.56v452.4c0 21.36 17.68 38.56 39.44 38.56h716.32c21.76 0 39.36-17.28 39.36-38.56V344.88c0-21.28-17.6-38.48-39.36-38.48zM527.92 610.96c49.92 108.56 105.04 28.8 105.04 28.8l31.28 20.4s-58.48 94.16-135.6 22.96c-65.2 71.28-133.76-22.64-133.76-22.64l34.8-22.32 0.24 0.48c3.92 6.56 48.56 78.56 98-27.68zM413.68 399.68l16 79.76-210.08 40.72-17.76-79.76 211.84-40.72z m235.44 0l211.76 40.72-17.84 79.76-210.16-40.72 16.24-79.76z m85.6-337.92c8.4-6 9.68-15.6 34.32 6 21.76 19.2 12.96 36.48 10.56 40.24l-0.48 0.8-93.12 97.04H596.24S726.4 67.84 734.72 61.76zM328 58.16c8.32 6 138.48 144.08 138.48 144.08H376.72L283.68 105.2s-14.56-19.28 10-41.04c24.8-21.6 26-12 34.32-6z m0 0"/>
                </svg>
                <a href="https://space.bilibili.com/315598901" target="_blank" rel="noopener" class="footer-link">bilibili</a>
              </li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">{{ $t('appreciate') }}</h4>
            <ul class="footer-links">

              <li class="social-icons">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M841.813333 253.269333c-0.938667 5.888-2.005333 11.946667-3.2 18.176-40.576 209.749333-179.498667 282.24-356.864 282.24H391.424a43.946667 43.946667 0 0 0-43.349333 37.376l-46.250667 295.210667-13.098667 83.626667a23.338667 23.338667 0 0 0 22.784 26.88h160.213334a38.613333 38.613333 0 0 0 38.058666-32.682667l1.578667-8.192 30.165333-192.64 1.962667-10.538667a38.613333 38.613333 0 0 1 38.058667-32.768h23.936c155.221333 0 276.736-63.445333 312.234666-246.954666 14.848-76.672 7.168-140.714667-32.085333-185.728a153.301333 153.301333 0 0 0-43.861333-34.005334z"
                      fill="#179BD7"/>
                  <path
                      d="M799.317333 236.202667a318.464 318.464 0 0 0-39.509333-8.789334 498.474667 498.474667 0 0 0-79.616-5.845333h-241.28a38.528 38.528 0 0 0-38.058667 32.768L349.525333 581.546667l-1.450666 9.514666a43.946667 43.946667 0 0 1 43.349333-37.376h90.325333c177.365333 0 316.288-72.533333 356.864-282.24 1.237333-6.229333 2.261333-12.288 3.157334-18.176a215.68 215.68 0 0 0-42.453334-17.066666z"
                      fill="#222D65"/>
                  <path
                      d="M400.853333 254.293333a38.442667 38.442667 0 0 1 38.058667-32.725333h241.28c28.586667 0 55.296 1.877333 79.616 5.845333 16.512 2.602667 32.768 6.528 48.64 11.690667 11.946667 3.968 23.082667 8.704 33.365333 14.165333 12.074667-77.525333-0.085333-130.304-41.770666-178.133333C754.133333 22.528 671.274667 0 565.248 0H257.365333c-21.632 0-40.106667 15.872-43.477333 37.418667L85.674667 855.466667a26.752 26.752 0 0 0 5.973333 21.461333c5.034667 5.888 12.373333 9.301333 20.096 9.344h190.08l47.701333-304.725333 51.328-327.253334z"
                      fill="#253B80"/>
                </svg>
                <a href="https://paypal.me/kxjjj?country.x=C2&locale.x=zh_XC" target="_blank" rel="noopener" class="footer-link">paypal</a>
              </li>
              <li class="social-icons">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path fill="#1afa29"
                        d="M695.296 346.112c11.776 0 23.552 1.024 34.816 2.048-31.232-146.432-187.904-254.976-366.592-254.976-199.68 0-363.52 136.192-363.52 308.736 0 99.84 54.272 181.76 145.408 245.248l-36.352 109.056L236.032 692.736c45.568 9.216 81.92 18.432 127.488 18.432 11.264 0 22.528-0.512 33.792-1.536-7.168-24.064-11.264-49.664-11.264-76.288 0.512-158.208 136.704-287.232 309.248-287.232zM497.664 240.64c31.232 0 56.32 25.088 56.32 56.32s-25.088 56.32-56.32 56.32-56.32-25.088-56.32-56.32 25.088-56.32 56.32-56.32zM243.2 353.792c-31.232 0-56.32-25.088-56.32-56.32s25.088-56.32 56.32-56.32 56.32 25.088 56.32 56.32-25.088 56.32-56.32 56.32zM1024.512 630.784c0-145.408-145.408-263.68-308.736-263.68-173.056 0-309.248 118.272-309.248 263.68s136.192 263.68 309.248 263.68c36.352 0 72.704-9.216 109.056-18.432l99.84 54.784-27.136-90.624c72.704-54.784 126.976-127.488 126.976-209.408z m-403.456-40.96c-22.016 0-39.936-17.92-39.936-39.936s17.92-39.936 39.936-39.936 39.936 17.92 39.936 39.936-17.92 39.936-39.936 39.936z m199.68 2.56c-22.016 0-39.936-17.92-39.936-39.936s17.92-39.936 39.936-39.936 39.936 17.92 39.936 39.936-17.92 39.936-39.936 39.936z"/>
                </svg>
                <a class="footer-link" @click="appreciate2">{{ $t('wechat') }}</a>
              </li>
              <li class="social-icons">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M1023.795 853.64v6.348a163.807 163.807 0 0 1-163.807 163.807h-696.18A163.807 163.807 0 0 1 0 859.988v-696.18A163.807 163.807 0 0 1 163.807 0h696.181a163.807 163.807 0 0 1 163.807 163.807V853.64z"
                      fill="#009FE9"/>
                  <path
                      d="M844.836 648.267c-40.952-14.333-95.623-34.809-156.846-57.128a949.058 949.058 0 0 0 90.094-222.573H573.325V307.14h245.711v-43.41l-245.71 2.458V143.33H472.173c-18.223 0-21.704 20.476-21.704 20.476v102.38H204.759v40.952h245.71v61.427H245.712v40.952h409.518a805.522 805.522 0 0 1-64.909 148.246c-128.384-42.795-266.186-77.604-354.233-55.08a213.564 213.564 0 0 0-112.003 63.27c-95.418 116.917-26.21 294.034 175.274 294.034 119.989 0 236.087-67.366 325.771-177.73 134.322 65.932 398.666 176.297 398.666 176.297V701.3s-32.352-4.095-178.96-53.033z m-563.702 144.97c-158.893 0-204.759-124.699-126.336-194.112a191.86 191.86 0 0 1 90.913-46.276c93.575-10.238 189.811 35.629 293.624 86.614-74.941 94.598-166.674 153.774-258.2 153.774z"
                      fill="#FFFFFF"/>
                </svg>
                <a class="footer-link" @click="appreciate1">{{ $t('alipay') }}</a>
              </li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">{{ $t('legal') }}</h4>
            <ul class="footer-links">
              <li>
                <a @click="toShowPolicy" class="footer-link">{{ $t('privacyPolicy') }}</a>
              </li>

            </ul>
          </div>
        </div>

        <div class="footer-copyright">
          <p>
            © 2025 KXJ All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


h1 {
  text-transform: uppercase;
  font-family: "Libre Baskerville", serif;
  font-size: 10em;
  line-height: 100%;
  font-weight: bold;
  background-image: radial-gradient(circle at 100% 107%, #ff89cc 0%, #9cb8ec 30%, #00ffee 60%, #62c2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


/* 基础样式 */
.footer {
  width: 100%;
  padding: 3rem 0;
}


.footer-container {

  margin: 0 auto;
  padding: 0 1rem;
}

/* 玻璃拟态效果 */
.footer-glass {
  padding: 2rem;

  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.2);

  border-radius: 30px;
  border: 2px solid rgba(211, 211, 211, 0.2);
  backdrop-filter: blur(8px);
}


/* 网格布局 */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 各部分样式 */
.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--font-color);
}

.social-button:hover .social-icon {
  fill: var(--theme-hover-color);
}

/* 链接列表 */
.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  font-size: 0.875rem;
  color: var(--border-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--active-color);
}

/* 版权信息 */
.footer-copyright {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--2-background-color);
}

.footer-copyright p {
  font-size: 0.875rem;
  color: var(--border-color);
  text-align: center;
}

.social-icons {
  display: flex;
  gap: 0.5rem;
}

.social-icons svg {

  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.social-icons:hover svg {
  color: var(--active-color);
  border-color: var(--active-color);
  transform: rotate(360deg) scale(1.1);
}
</style>