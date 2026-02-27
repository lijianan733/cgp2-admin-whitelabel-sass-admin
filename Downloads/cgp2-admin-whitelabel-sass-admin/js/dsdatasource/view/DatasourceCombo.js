/**
 * Created by admin on 2020/4/30.
 */
Ext.define("CGP.dsdatasource.view.DatasourceCombo",{
    extend:'Ext.ux.form.SingleGridComBox',
    alias: ['widget.datasourcecombo'],
    displayField: 'comboDisplay',
    valueField: '_id',
    store: null,
    matchFieldWidth: false,
    multiSelect: false,
    autoScroll: true,

    initComponent:function(){
        var me=this;
        if(Ext.isEmpty(me.store)){
            me.store=Ext.create('CGP.dsdatasource.store.DsdataSource');
        }
        me.gridCfg={
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
                        menuDisabled:true,
                        renderer: function (value, metaData) {
                            metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('type'),
                        width: 180,
                        menuDisabled:true,
                        dataIndex: 'type'
                    },
                    {
                        text: i18n.getKey('version'),
                        width: 100,
                        menuDisabled:true,
                        dataIndex: 'version'
                    },
                    {
                        text: i18n.getKey('description'),
                        width: 220,
                        dataIndex: 'description',
                        menuDisabled:true,
                        renderer: function (value, metaData, record, rowIndex) {
                            metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                            return value
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
                            fieldLabel: i18n.getKey('id'),
                            name: '_id',
                            isLike: false,
                            labelWidth: 40
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('type'),
                            name: 'type',
                            labelWidth: 40
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('search'),
                            handler: me.searchGridCombo,
                            width: 80
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('clear'),
                            handler: me.clearParams,
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
            };
        me.callParent(arguments);
    },
    diyGetValue:function(){
        var me=this;
        return Object.keys(me.getValue())[0];
    },
    diySetValue:function(data){
        var me=this;
        me.setSingleValue(data);
    },
    searchGridCombo: function () {
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
    clearParams: function () {
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


})