Ext.define('CGP.dssheettemplateconfig.view.window.gridconfig',{
    extend:'Ext.grid.Panel',

    height: 300,
    width: 500,
    autoScroll: true,

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
    initComponent:function(){
        var me=this;

        if(me.tbar){
            var tbarDefault={
                layout: {
                    type: 'column'
                },
                defaults: {
                    labelAlign: 'right',
                    width: 200,
                    isLike: false,
                    padding: 2
                },

                items: [
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
            }
            Ext.applyIf(me.tbar,tbarDefault);
            me.tbar.items=Ext.Array.merge(me.tbar.items,tbarDefault.items);
        }


        me.callParent();
    }

})