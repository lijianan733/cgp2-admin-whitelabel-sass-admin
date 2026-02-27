Ext.define('CGP.manufactureorderitem.controller.Controller',{
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
    searchProduct: function () {

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
            if(!Ext.isEmpty(items[i].isLike) && !items[i].isLike){
                query.value = items[i].getValue();
            }else if(Ext.isEmpty(items[i].isLike) || items[i].isLike){
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


    }
})