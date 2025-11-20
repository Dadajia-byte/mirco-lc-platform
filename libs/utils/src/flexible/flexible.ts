export interface FlexibleOptions {
  baseCount?: number;  // 默认 24 等份
  designWidth?: number; // 设计稿宽度，默认用于计算
  maxWidth?: number;    // 最大宽度限制
}

export class Flexible {
  private options: Required<FlexibleOptions>;

  constructor(options: FlexibleOptions = {}) {
    this.options = {
      baseCount: 24,
      designWidth: 375,
      maxWidth: 768,
      ...options
    };
    this.init();
  }

  private init() {
    const { baseCount, designWidth, maxWidth } = this.options;
    
    (function flexible(window, document) {
      var docEl = document.documentElement;
      var dpr = window.devicePixelRatio || 1;

      function setBodyFontSize() {
        if (document.body) {
          document.body.style.fontSize = 12 * dpr + "px";
        } else {
          document.addEventListener("DOMContentLoaded", setBodyFontSize);
        }
      }
      setBodyFontSize();

      function setRemUnit() {
        const clientWidth = Math.min(docEl.clientWidth, maxWidth);
        const rem = (clientWidth / designWidth) * (16 * baseCount / 10);
        docEl.style.fontSize = rem + "px";
      }

      setRemUnit();

      window.addEventListener("resize", setRemUnit);
      window.addEventListener("pageshow", function(e) {
        if (e.persisted) {
          setRemUnit();
        }
      });

      if (dpr >= 2) {
        var fakeBody = document.createElement("body");
        var testElement = document.createElement("div");
        testElement.style.border = ".5px solid transparent";
        fakeBody.appendChild(testElement);
        docEl.appendChild(fakeBody);
        if (testElement.offsetHeight === 1) {
          docEl.classList.add("hairlines");
        }
        docEl.removeChild(fakeBody);
      }
    })(window, document);
  }

  public destroy() {
    // 如果需要销毁功能，可以在这里添加 todo...
  }
}

/**
 * 初始化 flexible
 * @param options - 可选配置
 * @param options.baseCount - 默认 24 等份
 * @param options.designWidth - 设计稿宽度，默认用于计算
 * @param options.maxWidth - 最大宽度限制
 * @returns 
 */
export function initFlexible(options?: FlexibleOptions) {
  return new Flexible(options);
}