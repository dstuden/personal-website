<script>
export default {
    props: {
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
        }
    },
    methods: {
    },
    mounted() {

    }
}
</script>

<template>
    <div class="item">
        <h2>
            {{ title }}
        </h2>
        <div class="details">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style>
.item {
    background: var(--white);
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    max-width: 40em;
    border-radius: 1em;
    box-shadow: 0.2em 0.2em 1em var(--background-secondary);
}

.item:hover {
    box-shadow: 0.2em 0.2em 1em var(--foreground);
    transition-duration: 0.5s;
}

.item h2 {
    font-size: 1.5em;
    color: var(--foreground);
    text-align: center;
    line-height: 2;
    background: var(--background-secondary);
    border-radius: 0.5em 0.5em 0 0;
    font-weight: bold;
}

.details {
    padding: 1em;
}

@media (max-width: 1024px) {
    .item {
        max-width: 30em;
    }
}
</style>