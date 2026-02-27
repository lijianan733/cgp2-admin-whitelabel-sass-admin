Ext.define('CGP.resource.controller.Image', {
    extend: 'Ext.app.Controller',
    stores: [
        'Image'
    ],
    models: ['Image'],
    views: [
        'image.Main',
        'image.EditTest'
    ],
    init: function() {
        this.control({
            // 'viewport > panel': {
            //     render: this.onPanelRendered
            // },
            // '#imageMain gridpanel': {
            //     itemdblclick: this.editImage
            // }
        });
    },
    // onPanelRendered: function() {
    //     console.log('The panel was rendered');
    // },
    editImage: function(grid, record) {
        var view = Ext.widget('edittest');
        view.down('form').loadRecord(record);
    }
});