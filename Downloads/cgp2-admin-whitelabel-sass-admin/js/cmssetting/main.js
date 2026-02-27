/**
 *
 */
Ext.syncRequire('CGP.common.store.Website');
Ext.onReady(function () {




    var controller = Ext.create('CGP.cmssetting.controller.Controller');
    var configPage = Ext.create('Ext.container.Viewport', {
        renderTo: Ext.getBody(),
        id: 'cmssetting',
        frame: false,
        //height: auto,
        //width: 1000,
        layout: 'border',
        items: [
            {
                region: 'center',
                layout: 'fit',
                itemId: 'center',
                autoScroll: true,
                items: []
            },
            {
                xtype: 'form',
                itemId: 'webistePanel',
                region: 'north',
                height: 80,
                title: i18n.getKey('query'),
                border: false,
                items: [{
                    xtype: 'combo',
                    itemId: 'website',
                    valueField: 'id',
                    displayField: 'name',
                    editable: false,
                    width: 350,
                    labelAlign : 'right',
                    style : {
                        marginTop: '10px'
                    },
                    name: 'website',
                    fieldLabel: i18n.getKey('selectWebsite'),
                    autoScroll: true,
                    store: Ext.create('CGP.common.store.Website'),
                    listeners: {
                        'change': function (field, newValue, oldValue) {
                                controller.previewConfig();
                        },
                        afterrender: function(combo){
                            var websiteStore = combo.getStore();
                            websiteStore.on('load', function () {
                                combo.select(websiteStore.getAt(0));
                            });
                        }
                    }
                }]
            }
        ]

    });

});

