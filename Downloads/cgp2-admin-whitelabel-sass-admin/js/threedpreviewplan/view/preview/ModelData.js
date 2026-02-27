Ext.define('CGP.threedpreviewplan.view.preview.ModelData', {
    extend: 'Ext.panel.Panel',


    defaultType: 'displayfield',
    bodyStyle: 'border-color:silver;',
    //border: '0 0 0 1',
    header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 1 1 1'
    },
    //header: false,
    border: false,

    layout: {
        type: 'table',
        columns: 6
    },
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 430
    },

    initComponent: function () {

        var me = this;


        me.items = [Ext.create('CGP.threedpreviewplan.view.ModelVariableForm', {
            tipText: 'test'
        })];

        me.title = '<font color=green>' + i18n.getKey('linkman') + '</font>'
        /*me.tbar = [{
            xtype: 'displayfield',
            fieldLabel: false,
            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('linkman') + '</font>'
        },{
            xtype: 'button',
            text: i18n.getKey('edit'),
            action: 'edit'
        }];*/

        me.callParent(arguments);

    },
    addItems: function (data) {
        var me = this;
        Ext.Array.each(data, function (item) {
            var setItem = Ext.create('CGP.threedpreviewplan.view.component.TextureImageSet', {
                title: data.name,
                data: item
            });
            me.add(setItem);
        });
    },
    getValue: function () {
        var items = this.items.items;
        var result = [];
        Ext.Array.each(items, function (item) {
            result.push(item.getValue());
        })
        return result;
    },
    setValue: function (data) {
        var items = this.items.items;
        Ext.Array.each(items, function (item) {
            item.setTitle('');
            item.setValue(data[item.name]);
        })
    }
})
