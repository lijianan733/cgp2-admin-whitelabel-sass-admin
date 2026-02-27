Ext.define('CGP.resource.controller.Ornament', {
    extend: 'Ext.app.Controller',
    stores: [
        'Ornament'
    ],
    models: ['Ornament'],
    views: [
        'ornament.Main'
    ],
    init: function() {
        this.control({

        });
    }

});