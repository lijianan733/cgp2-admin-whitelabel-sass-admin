/**
 * @author nan
 * @date 2025/5/15
 * @description TODO
 */
Ext.Loader.syncRequire([
    'CGP.country.store.CountryStore'
])
Ext.define("CGP.qpmn_tax.view.ManufactureCenterSelector", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.manufacture_center_selector',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    valueField: 'isoCode2',
    displayField: 'isoCode2',
    valueType: 'id',//recordData,idReference,id为可选的值类型
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.country.store.CountryStore');
        me.store = store;
        me.gridCfg = Ext.Object.merge({
            store: store,
            height: 420,
            width: 650,
            autoScroll: true,
            columns: [
                {
                    text: i18n.getKey('id'),
                    width: 80,
                    dataIndex: 'id',
                },
                {
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name'
                },
                {
                    text: i18n.getKey('isoCode2'),
                    width: 160,
                    dataIndex: 'isoCode2'
                },
                {
                    text: i18n.getKey('isoCode3'),
                    flex: 1,
                    dataIndex: 'isoCode3'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: store
            })
        }, me.gridCfg);
        me.filterCfg = {
            layout: {
                type: 'table',
                columns: 2
            },
            items: [{
                name: 'id',
                xtype: 'numberfield',
                allowDecimals: false,
                hideTrigger: true,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'isoCode2',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('isoCode') + "(2)",
                itemId: 'isoCode2',
                diyGetValue: function () {
                    var me = this;
                    return me.getValue()?.toUpperCase();
                }
            }, {
                name: 'isoCode3',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('isoCode') + "(3)",
                itemId: 'isoCode3',
                diyGetValue: function () {
                    var me = this;
                    return me.getValue()?.toUpperCase();
                }
            }]
        };
        me.callParent(arguments);
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            me.setValue({
                isoCode2: data
            });
        }
    },
    diyGetValue: function () {
        var comp = this,
            data = null;
        data = comp.getArrayValue();
        return data;
    }
})