/**
 * CountryCombo
 * @Author: miao
 * @Date: 2022/01/10
 */
Ext.define("CGP.returnorder.common.UserCombo", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.usercombo',
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
            width: 500,
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
                    text: i18n.getKey('username'),
                    width: 160,
                    dataIndex: 'firstName',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('email'),
                    flex: 1,
                    dataIndex: 'email',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
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
                    itemId: 'firstName',
                    fieldLabel: i18n.getKey('username'),
                    name: 'firstName',
                    labelWidth: 40
                },
                {
                    xtype: 'textfield',
                    itemId: 'emailAddress',
                    fieldLabel: i18n.getKey('email'),
                    name: 'emailAddress',
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
        return Ext.isEmpty(data)?data:data.toString();
    }
});