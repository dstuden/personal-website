const animatedScrollObserver = new IntersectionObserver(
    (entries, animatedScrollObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target.getBoundingClientRect().left >= (window.innerWidth / 2)) {
                    entry.target.classList.add("animRight")
                }
                else if (entry.target.getBoundingClientRect().left < (window.innerWidth / 2)) {
                    entry.target.classList.add("animLeft")
                }
                animatedScrollObserver.unobserve(entry.target)
            }
        })
    }
)

export default {
    bind(el) {
        animatedScrollObserver.observe(el)
    }
}