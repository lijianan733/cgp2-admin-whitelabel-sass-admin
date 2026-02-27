/**
 * CountryCombo
 * @Author: miao
 * @Date: 2021/11/2
 */
Ext.define("CGP.tax.common.CountryCombo", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.countrycombo',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    autoScroll: true,
    store: null,

    initComponent: function () {
        var me = this;
        me.gridCfg = {
            store: me.store,
            height: 300,
            width: 400,
            autoScroll: true,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 80,
                    dataIndex: 'id',
                    renderer: function (value, metaData) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name'
                },
                {
                    text: i18n.getKey('isoCode3'),
                    width: 160,
                    dataIndex: 'isoCode3'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store
            })
        };
        me.filterCfg={
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
                    itemId: 'id',
                    fieldLabel: i18n.getKey('id'),
                    name: 'id',
                    isLike: false,
                    labelWidth: 40,
                    minValue:1
                },
                {
                    xtype: 'textfield',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                    labelWidth: 40
                },
            ]
        };
        me.callParent(arguments);
    },
    diySetValue:function (data){
        var me=this;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        me.setValue(data);
        // if(data?.id){
        //     comp.setInitialValue([data?.id]);
        // }
    },
    diyGetValue:function (){
        var comp=this,data=null;
        data=comp.getArrayValue();
        return data;
    }
});