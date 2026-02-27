/**
 * StateCombo
 * @Author: miao
 * @Date: 2021/11/2
 */
Ext.define("CGP.tax.common.StateCombo", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.statecombo',
    haveReset: true,
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
                    width: 100,
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
                    text: i18n.getKey('code'),
                    width: 160,
                    dataIndex: 'code'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                emptyMsg: i18n.getKey('noData')
            })
        };
        me.filterCfg = {
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
                    itemId:'countryId',
                    fieldLabel: i18n.getKey('countryId'),
                    name: 'country.id',
                    labelWidth: 40,
                    hidden: true,
                    listeners:{
                        afterrender:function (comp){
                            comp.setValue(me.contryId);
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    itemId:'stateId',
                    fieldLabel: i18n.getKey('id'),
                    name: 'id',
                    isLike: false,
                    labelWidth: 40,
                    minValue:1
                },
                {
                    xtype: 'textfield',
                    itemId:'name',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                    labelWidth: 40
                }
            ]
        };
        me.callParent(arguments);
    },
    diySetValue: function (data) {
        var me=this;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        me.data = data;
        me.setValue(data);
        // if (data?.id) {
        //     comp.setInitialValue([data?.id]);
        // }
    },
    diyGetValue: function () {
        var comp = this, data = null;
        data = comp.getArrayValue();
        return data;
    }
});