/**
 * Created by admin on 2021/03/05.
 */
Ext.define('CGP.tools.freemark.template.view.TemplateGrid', {
    extend: 'Ext.ux.grid.Panel',
    store:Ext.create("CGP.tools.freemark.template.store.FreemarkTemplate"),
    constructor: function (config) {
        var me = this;
        var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
        config.store=Ext.create("CGP.tools.freemark.template.store.FreemarkTemplate");
        config.columns=[
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                xtype: 'gridcolumn',
                itemId: '_id',
                sortable: true
            },
            {
                text: i18n.getKey('productId'),
                dataIndex: 'productId',
                xtype: 'gridcolumn',
                itemId: 'productId',
                width: 120,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                xtype: 'gridcolumn',
                itemId: 'description',
                width: 160,
                sortable: true
            },
            {
                text: i18n.getKey('variable'),
                dataIndex: 'items',
                xtype: 'componentcolumn',
                itemId: 'items',
                flex: 1,
                renderer: function (value, metadata, record) {
                    if (value) {
                        var keys =[];
                        if(value&& Array.isArray(value)){
                            keys=controller.getVarKeys(value).map(function (item){
                                return item.name;
                            });
                        }
                        var strKey=keys.toString();
                        metadata.tdAttr = 'data-qtip="' + strKey + '"';
                        return {
                            xtype: 'displayfield',
                            value: strKey,
                            // listeners: {
                            //     render: function (display) {
                            //         var clickElement = document.getElementById('click-params');
                            //         clickElement.addEventListener('click', function () {
                            //             var wind=Ext.create("Ext.window.Window",{
                            //                 itemId: "pageParams",
                            //                 title: i18n.getKey('pageParams'),
                            //                 layout: 'fit',
                            //                 items: [
                            //                     Ext.create('CGP.pages.view.Params',{data:value})
                            //                 ]
                            //             });
                            //             wind.show();
                            //         },false);
                            //     }
                            // }
                        }
                    } else {
                        return "";
                    }
                }
            }
        ];
        me.callParent([config]);
    },
    initComponent: function () {
        var me = this;

        me.callParent();
    },

})