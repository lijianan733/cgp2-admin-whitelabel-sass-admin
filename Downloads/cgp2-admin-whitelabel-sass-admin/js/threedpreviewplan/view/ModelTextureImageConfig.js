Ext.define('CGP.threedpreviewplan.view.ModelTextureImageConfig', {
    extend: 'Ext.form.Panel',


    defaultType: 'displayfield',
    //border: '0 0 0 1',
    header: {
        style: 'background-color:white;border-color:blue;',
        color: 'white'
    },
    //header: false,
    border: false,
    layout: {
        type: 'table',
        columns: 6
    },
    //style: 'border-color:silver;border-width:0 0px 0px 1px;',
    bodyStyle: 'border-color:black;border-width:1 1px 1px 1px;',
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 430
    },

    initComponent: function () {

        var me = this;


        me.items = [];

        me.title = '<font color=green>' + i18n.getKey('texture') + '</font>'

        me.callParent(arguments);

    },
    addItems: function (data) {
        var me = this;
        Ext.Array.each(data, function (item) {
            var setItem = Ext.create('CGP.threedpreviewplan.view.component.TextureImageSet', {
                title: item.name,
                fieldMargin: me.fieldMargin,
                preview: me.preview,
                data: item
            });
            me.add(setItem);
        });
    },
    getValue: function () {
        var items = this.items.items;
        var result = [];
        Ext.Array.each(items, function (item) {
            var data = item.getValue();
            data.clazz = 'com.qpp.cgp.dto.product.config.model.AssetsInfo';
            result.push(data);
        })
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.removeAll();
        me.addItems(data);
        var items = this.items.items;
        Ext.Array.each(items,function (item){
            item.setValue(item.data);
        })
    }
})
