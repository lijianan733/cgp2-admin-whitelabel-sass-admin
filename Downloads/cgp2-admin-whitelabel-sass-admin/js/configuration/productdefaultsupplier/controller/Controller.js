/**
 * Created by nan on 2018/4/20.
 */
Ext.define('CGP.configuration.productdefaultsupplier.controller.Controller', {
    searchProduct: function () {
        var me = this;
        var websiteId = me.websiteId;
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
            if (items[i].xtype == 'numberfield') {
                query.type = 'number';

            } else {
                query.type = 'string';
            }
            queries.push(query);
            //添加对应的websiteId过滤
            queries.push({name: "mainCategory.website.id", value: websiteId, type: "number"})
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(Ext.Array.merge(Ext.JSON.decode(store.proxy.extraParams.filter), queries))
            }
        }

        store.loadPage(1);


    },
    clearParams: function () {
        var me = this;
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = {
            filter: Ext.JSON.encode([
                {name: "mainCategory.website.id", value: me.websiteId, type: "number"},
                {name: "type", value: "%sku%", type: "number"}
            ])
        }
    },
    searchPartner: function () {
        var me = this;
        var websiteId = me.websiteId;
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
            if (items[i].xtype == 'numberfield') {
                query.type = 'number';

            } else {
                query.type = 'string';
            }
            queries.push(query);
            //添加对应的websiteId过滤
            queries.push({name: "website.id", value: websiteId, type: "number"})
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode([
                    {name: "website.id", value: websiteId, type: "number"}
                ])
            }
        }
        store.loadPage(1);
    },
    clearPartnerParams: function () {
        var me = this;
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();

        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = {
            filter: Ext.JSON.encode([
                {name: "website.id", value: me.websiteId, type: "number"}
            ])
        }
    },
    searchAllProduct: function (websiteId, button) {
        var me = button;
        var websiteId = websiteId;
        var queries = [];
        var items = me.ownerCt.items.items;
        var store = me.ownerCt.ownerCt.getStore();
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
            if (items[i].xtype == 'numberfield') {
                query.type = 'number';

            } else {
                query.type = 'string';
            }
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams.filter = {
                filter: Ext.JSON.encode(Ext.Array.merge(Ext.JSON.decode(store.proxy.extraParams.filter), queries))
            }
        }
        store.loadPage(1);
    },
    clearAllProductParam: function (websiteId, button) {
        var me = button;
        var items = me.ownerCt.items.items;
        var store = me.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }
        store.proxy.extraParams = {
            filter: '[{"name":"type","value":"%Sku%","type":"string"},{"name":"mainCategory.website.id","value":' + parseInt(websiteId) + ',"type":"number"}]'
        };
        store.load();
    }
})