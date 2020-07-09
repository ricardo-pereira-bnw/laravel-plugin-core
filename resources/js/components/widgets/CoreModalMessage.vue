<template>

  <div>

    <b-modal ref="modal-message-widget" class="modal-message" centered ok-only>
        <span slot="modal-title">{{ title }}</span>
        <div>{{ message }}</div>
    </b-modal>

  </div>

</template>

<script>
  export default {
    data: function () {
      return {
        title: 'Mensagem',
		    message: 'Nenhuma mensagem definida'
      }
    }
  }
</script>

