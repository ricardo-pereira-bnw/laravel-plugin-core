<template>

    <div>

      <b-modal ref="modal-confirm-widget" class="modal-confirm" centered>

          <template slot="modal-title">{{ title }}</template>

          <div>{{ message }}</div>

          <template slot="modal-footer">
            <b-button variant="success" @click="yes()">
              Sim
            </b-button>
            <b-button variant="danger" @click="no()">
              Não
            </b-button>
          </template>
      </b-modal>

    </div>

</template>

<script>
  export default {
    data: function () {
      return {
        title: 'Confirmação',
		    message: 'Nenhuma pergunta definida',
        callback: function(response){ }
      }
    },
    methods: {  
      yes(){
        this.callback('yes')
        this.$refs['modal-confirm-widget'].hide()
      },
      no(){
        this.callback('no')
        this.$refs['modal-confirm-widget'].hide()
      }
    }
  }
</script>

