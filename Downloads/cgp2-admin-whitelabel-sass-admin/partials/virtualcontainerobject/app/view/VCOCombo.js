Ext.define('CGP.virtualcontainerobject.view.VCOCombo', {
    extend: 'Ext.form.field.GridComboBox',
    alias: 'widget.vcocombo',
    autoScroll: true,
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.addEvents('afterload');
        me.callParent([config]);
    },
    initComponent: function () {
        var me = this;
        me.gridCfg = {
            store: me.store,
            height: 300,
            width: 600,
            autoScroll: true,
            //hideHeaders : true,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 80,
                    dataIndex: '_id',
                    renderer: function (value, metaData) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    width: 180,
                    dataIndex: 'description'
                },
                {
                    text: i18n.getKey('containerType'),
                    dataIndex: 'containerType',
                    flex: 1,
                    renderer: function (value, metaData) {
                        var displayValue=Ext.String.format("{0}<{1}>",value?.description,value?._id);
                        metaData.tdAttr = 'data-qtip="' + "<div>" + displayValue + "</div>" + '"';
                        return displayValue;
                    }
                }
            ],
            tbar: {
                layout: {
                    type: 'column'
                },
                defaults: {
                    width: 170,
                    isLike: false,
                    padding: 2
                },
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('_id'),
                        name: 'id',
                        isLike: false,
                        labelWidth: 40
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('description'),
                        name: 'description',
                        labelWidth: 40
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('search'),
                        width: 80,
                        handler: function () {
                            var queries = [];
                            var items = this.ownerCt.items.items;
                            var store = this.ownerCt.ownerCt.getStore();
                            var params = {};
                            for (var i = 0; i < items.length; i++) {
                                var query = {};
                                if (items[i].xtype == 'button')
                                    continue;
                                if (Ext.isEmpty(items[i].value))
                                    continue;
                                query.name = items[i].name;
                                if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                                    query.value = items[i].getValue();
                                } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                                    query.value = '%' + items[i].getValue() + '%'
                                }
                                query.type = 'string';
                                queries.push(query);
                            }

                            if (queries.length > 0) {
                                store.proxy.extraParams = {
                                    filter: Ext.JSON.encode(queries)
                                }
                            } else {
                                store.proxy.extraParams = null;
                            }
                            store.loadPage(1);
                        },
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('clear'),
                        handler: function () {
                            var items = this.ownerCt.items.items;
                            var store = this.ownerCt.ownerCt.getStore();
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].xtype == 'button')
                                    continue;
                                if (Ext.isEmpty(items[i].value))
                                    continue;
                                items[i].setValue('');
                            }
                            store.proxy.extraParams = null;
                        },
                        width: 80
                    }
                ]
            },
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            })
        }
        me.callParent(arguments);
    },

})