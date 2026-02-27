Ext.Loader.syncRequire(['CGP.common.store.WebsiteObject']);
Ext.define('CGP.cmspage.view.cmsvariable.CmsVariableWin', {
    extend: 'Ext.window.Window',


    modal: true,
    layout: 'fit',
    id: 'productWin',
    initComponent: function () {
        var me = this;
        var websiteStore = Ext.StoreManager.lookup('websiteStore');
        me.title = me.record.get('name') + '_' + i18n.getKey('cmsvariable');
        me.listeners = {
            close: function () {
                me.getComponent('pageCmsVariableGrid').collection.clear();
            }
        };
        var pageCmsVariableStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'int',
                    useNull: true
                }, {
                    name: 'code',
                    type: 'string'
                }, {
                    name: 'description',
                    type: 'string'
                }, {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'websiteId',
                    type: 'int'
                }, {
                    name: 'selector',
                    type: 'string'
                }, {
                    name: 'value',
                    type: 'string'
                }, {
                    name: 'name',
                    type: 'string'
                }, {
                    name: 'website',
                    type: 'object'
                }
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/cmsPages/' + me.pageId + '/variables',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
            autoLoad: true
        });
        me.items = [Ext.create('CGP.cmspage.view.cmsvariable.CmsVariableGrid', {
            itemId: 'pageCmsVariableGrid',
            record: me.record,
            store: pageCmsVariableStore,
            websiteStore: websiteStore,
            diyGridCfg: {
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_create',
                        handler: function (btn) {
                            var data = me.down("grid").getStore().data.items;
                            var store = me.down("grid").getStore();
                            me.controller.showAddCmsVariableWin(data, store, me.pageId, me.record);
                        }
                    },
                   {
                        xtype: 'button',
                        text: i18n.getKey('delete'),
                        iconCls: 'icon_delete',
                        handler: function (btn) {
                            me.controller.deleteCmsVariable(me);
                        }
                    }
                ]
            }
        })];
        me.callParent(arguments);
    }
})