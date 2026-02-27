Ext.Loader.syncRequire(['CGP.common.store.WebsiteObject']);
Ext.onReady(function () {



    var websiteStore = Ext.StoreManager.lookup('websiteStore');
    var store = Ext.create("CGP.cmspublishgoals.store.CmsPublishGoal");
    var controller = Ext.create('CGP.cmspublishgoals.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('cmsPublishGoal'),
        block: 'cmspublishgoals',
        editPage: 'edit.html',

        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            viewConfig : {
                enableTextSelection : true
            },
            columns: [{
                sortable: false,
                text: i18n.getKey('operation'),
                width: 100,
                autoSizeColumn: false,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    return {
                        xtype: 'toolbar',
                        layout: 'column',
                        style: 'padding:0',
                        default: {
                            width: 100
                        },
                        items: [
                            {
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            text: i18n.getKey('publish'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function(){
                                                var id = record.get('id');
                                                var jenkinsTaskUrl = record.get('jenkinsTaskUrl');
                                                controller.publish(id,jenkinsTaskUrl)
                                            }
                                        },
                                        {
                                            text: i18n.getKey('managerPageQuery'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function(){
                                                var pageQueryId = record.get('pageQueryId');
                                                var type = 'query';
                                                var title = 'pageQuery';
                                                var id = record.get('id');
                                                controller.managerQueryOrFilter(pageQueryId,type,title,id)
                                            }
                                        },{
                                            text: i18n.getKey('managerPageFilter'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function(){
                                                var  pageFilterId = record.get('pageFilterId');
                                                var type = 'filter';
                                                var title = 'pageFilter';
                                                var id = record.get('id');
                                                controller.managerQueryOrFilter(pageFilterId,type,title,id)
                                            }
                                        },{
                                            text: i18n.getKey('managerProductQuery'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function(){
                                                var productQueryId = record.get('productQueryId');
                                                var type = 'query';
                                                var title = 'productQuery';
                                                var id = record.get('id');
                                                controller.managerQueryOrFilter(productQueryId,type,title,id)
                                            }
                                        },{
                                            text: i18n.getKey('managerProductFilter'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function(){
                                                var productFilterId = record.get('productFilterId');
                                                var type = 'filter';
                                                var title = 'productFilter';
                                                var id = record.get('id');
                                                controller.managerQueryOrFilter(productFilterId,type,title,id);
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            },{
                text: i18n.getKey('id'),
                dataIndex: 'id',
                xtype: 'gridcolumn',
                itemId: 'id',
                sortable: true
            },{
                text: i18n.getKey('name'),
                dataIndex: 'name',
                xtype: 'gridcolumn',
                width : 180,
                sortable : false,
                itemId: 'name'
            }, {
                text: i18n.getKey('website'),
                dataIndex: 'website',
                width: 120,
                sortable: false,
                renderer: function (value, metadata, record){
                    return value['name'] ;
                }
            },{
                text: i18n.getKey('jenkinsTaskUrl'),
                dataIndex: 'jenkinsTaskUrl',
                xtype: 'gridcolumn',
                width : 350,
                sortable : false,
                itemId: 'jenkinsTaskUrl',
                renderer: function (value, metadata, record){
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value ;
                }
            }]
        },
        // 搜索框
        filterCfg: {
            items: [{
                name: 'id',
                xtype: 'numberfield',
                hideTrigger: true,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'variableName'
            },{
                name: 'jenkinsTaskUrl',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('jenkinsTaskUrl'),
                itemId: 'jenkinsTaskUrl'
            }, {
                fieldLabel: i18n.getKey('website'),
                id: 'websiteSearch',
                name: 'website.id',
                itemId: 'website',
                xtype: 'combo',
                store: websiteStore,
                displayField: 'name',
                valueField: 'id',
                editable: false,
                value:11,
                listeners: {
                    afterrender: function (combo) {
                        var store = combo.getStore();
                        store.on('load', function () {
                            this.insert(0, {
                                id: null,
                                name: i18n.getKey('allWebsite')
                            });
                            // combo.select(store.getAt(0));
                        });
                    }
                }
            }]
        }

    });
});