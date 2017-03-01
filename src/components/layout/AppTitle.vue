<template>
    <div class="page-head">
        <div class="container-fluid">
            <div class="page-title">
                <h1 v-text="pageTitle"></h1>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            pageTitle: function() {
                return this.store.pageTitle;
            }
        }
    }
</script>