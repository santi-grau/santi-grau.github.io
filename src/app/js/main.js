const sectionEls = document.querySelectorAll("app-module");

const observer = new IntersectionObserver(entries => {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-intersecting");
    } else {
      entry.target.classList.remove("is-intersecting");
    }
  });
}, { rootMargin: "-100% 0% 0% 0%" });

sectionEls.forEach(el => observer.observe(el));

class Main{
    constructor(){
        this.title = document.querySelector( 'h1' )
        requestAnimationFrame( ( time ) => this.step( time ) )
    }

    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.title.style.color = 'rgba( ' + Math.floor( Math.random() * 255 ) + ', ' + Math.floor( Math.random() * 255 ) + ', ' + Math.floor( Math.random() * 255 ) + ', 1 )'
        this.title.style.textDecoration = ( Math.random() > 0.5 ) ? 'none' : 'underline'
    }
}

new Main()