<!-- src/components/HelloDecorator.vue -->
<!-- This is an alternative way to define the Hello component using decorators -->
<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class HelloDecorator extends Vue {
    @Prop({ required: true }) name!: string
    @Prop({ required: true }) initialEnthusiasm!: number

    enthusiasm = this.initialEnthusiasm;
    //enthusiasm = 5;


    increment() {
        this.enthusiasm++;
    }
    decrement() {
        if (this.enthusiasm > 1) {
            this.enthusiasm--;
        }
    }

    @Watch("enthusiasm")
    printEntusiasm(newV: number, old: number) {
        console.log("ent:" + newV)
    }

    get exclamationMarks(): string {
        return Array(this.enthusiasm + 1).join('!');
    }
}
</script>

<style scoped>
.greeting {
    font-size: 20px;
}
</style>