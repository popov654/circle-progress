var st = document.createElement('style')
st.textContent = '.circle-progress {\n' +
    '         width: 100%;\n' +
    '         height: 100%;\n' +
    '         position: relative;\n' +
    '         overflow: hidden;\n' +
    '      }\n' +
    '      .circle-progress > div {\n' +
    '         position: relative;\n' +
    '         width: 100%;\n' +
    '         height: 100%;\n' +
    '         overflow: hidden;\n' +
    '         box-sizing: border-box;\n' +
    '         padding: 2px;\n' +
    '      }\n' +
    '      .circle-progress > div > div {\n' +
    '         box-sizing: border-box;\n' +
    '         width: 100%;\n' +
    '         height: 100%;\n' +
    '         border-width: 30px;\n' +
    '         border-style: solid;\n' +
    '         border-color: #fff;\n' +
    '         border-radius: 50%;\n' +
    '         position: absolute;\n' +
    '         top: 0;\n' +
    '         left: 0;\n' +
    '         text-align: center;\n' +
    '      }\n' +
    '      .circle-progress .left {\n' +
    '         clip: rect(0 100px 200px 0);\n' +
    '         border-color: #4b86db;\n' +
    '         opacity: 0;\n' +
    '         transform: rotate(180deg);\n' +
    '         transition: transform 0.6s linear;\n' +
    '      }\n' +
    '      .circle-progress .right {\n' +
    '         clip: rect(0 200px 200px 100px);\n' +
    '         border-color: #4b86db;\n' +
    '         opacity: 0;\n' +
    '         transform: rotate(-180deg);\n' +
    '         transition: transform 0.6s linear;\n' +
    '      }\n' +
    '      .circle-progress .left-back {\n' +
    '         clip: rect(0 100px 200px 0);\n' +
    '      }\n' +
    '      .circle-progress .right-back {\n' +
    '         clip: rect(0 200px 200px 100px);\n' +
    '      }\n' +
    '      .circle-progress .text {\n' +
    '         font-size: 2rem;\n' +
    '         line-height: 2rem;\n' +
    '         position: absolute;\n' +
    '         top: 40%;\n' +
    '         font-family: Arial, Helvetica, Sans-Serif;\n' +
    '         text-align: center;\n' +
    '      }'
document.head.appendChild(st)

window['$circle_progress'] = function(el, col, backcol) {

   el.innerHTML = '<div class="circle-progress"><div><div class="left"></div><div class="left-back"></div></div><div><div class="right"></div><div class="right-back"></div></div><div class="text">0</div></div>'
   el = el.children[0]
   
   var left = el.querySelector('.left')
   var right = el.querySelector('.right')
   
   var left_back = el.querySelector('.left-back')
   var right_back = el.querySelector('.right-back')
   
   if (!backcol) {
      var st = left_back.currentStyle || getComputedStyle(left_back, '')
      backcol = st.backgroundColor
      if (backcol.replace(/\s/g, '') == 'rgba(0,0,0,0)') {
         backcol = 'transparent'
      }
   }

   el.style.display = 'block'
   var w = el.clientWidth
   
   for (var i = 0; i < el.children[0].children.length; i++) {
      el.children[0].children[i].style.borderWidth = 0.15 * w + 'px'
      el.children[1].children[i].style.borderWidth = 0.15 * w + 'px'
   }
   el.style.display = 'none'
      
   var text = el.querySelector('.text')
   if (text) {
      text.style.fontSize = text.style.lineHeight = w * 0.2 + 'px'
   }
   
   return {
      el: el,
      val: 0,
      lastVal: 0,
      fxStartTime: null,
      backcol: backcol,
      update: function(progress) {
         var prev_val = this.val
         progress = Math.max(0, Math.min(1, progress))
         this.val = progress
         
         var text = this.el.querySelector('.text')
         if (text) {
            text.textContent = Math.min(Math.round(progress * 100), 100)
         }
         
         var left = this.el.querySelector('.left')
         var right = this.el.querySelector('.right')
         
         if (progress <= 0.5) {
            
            var deg = -180 + 360 * progress

            var st = left.currentStyle || getComputedStyle(left, '')
            var t = parseFloat(st.transitionDuration) * 1000
            
            t = t - (this.fxStartTime ? Math.max(0, +(new Date()) - this.fxStartTime) : 0)
            t = this.lastVal > 0.5 ? t : 0
            
            left.style.transform = 'rotate(180deg)'
            
            var self = this
            
            setTimeout(function() {
               right.style.transform = 'rotate(' + deg + 'deg)'
               left.ontransitionend = null
               right.ontransitionend = null
               this.fxStartTime = +(new Date())
               var val = self.val
               var target = val < 0.5 ? right : left
               target.ontransitionend = function() {
                  self.lastVal = val
                  self.fxStartTime = null
                  this.ontransitionend = null
               }
            }, t)
         } else {

            var deg = 180 + 360 * (progress - 0.5)
            
            var st = right.currentStyle || getComputedStyle(right, '')
            var t = parseFloat(st.transitionDuration) * 1000
            
            t = t - (this.fxStartTime ? Math.max(0, +(new Date()) - this.fxStartTime) : 0)
            t = this.lastVal < 0.5 ? t : 0
            
            right.style.transform = 'rotate(0deg)'
            
            var self = this
            
            setTimeout(function() {
               left.style.transform = 'rotate(' + deg + 'deg)'
               left.ontransitionend = null
               right.ontransitionend = null
               this.fxStartTime = +(new Date())
               var val = self.val
               var target = val < 0.5 ? right : left
               target.ontransitionend = function() {
                  self.lastVal = val
                  self.fxStartTime = null
                  this.ontransitionend = null
               }
            }, t)
         }
         return this
      },
      show: function() {
         this.el.style.display = ''
         this.el.style.visibility = 'visible'
         this.el.style.opacity = '1'
         return this
      },
      hide: function() {
         this.el.style.opacity = '0'
         var el = this.el
         setTimeout(function() {
            el.style.display = 'none'
         }, 1000)
         return this
      }, 
      reset: function() {
         this.update(0)
         return this
      }
   }
}