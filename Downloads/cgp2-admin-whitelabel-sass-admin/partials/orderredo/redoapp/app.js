/**
 * Created by admin on 2019/9/29.
 */
Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'CGP.redodetails',

    appFolder: 'redoapp',
//    controllers: [
//        'RedoDetails'
//    ],

    status: 1,

    launch: function () {
        var me = this;
//        var permissions = Ext.create('CGP.orderlineitems.controller.Permission');
//        window.permissions = permissions;
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                Ext.create('CGP.redodetails.view.RedoDetails')
            ]
        })
    }

});