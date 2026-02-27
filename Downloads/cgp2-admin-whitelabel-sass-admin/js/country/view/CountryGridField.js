/**
 * @Description:
 * @author nan
 * @date 2023/8/2
 */
Ext.define("CGP.country.view.CountryGridField", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.country_gridfield',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    autoScroll: true,
    store: null,
    diyGetValue: function () {
        var me = this;
        return me.getArrayValue();
    },
    initComponent: function () {
        var me = this;
        me.gridCfg = Ext.Object.merge({
            store: me.store,
            height: 450,
            width: 550,
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
                    text: i18n.getKey('isoCode') + '2',
                    width: 160,
                    dataIndex: 'isoCode2'
                },
                {
                    text: i18n.getKey('isoCode') + '3',
                    flex: 1,
                    dataIndex: 'isoCode3'
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store
            })
        }, me.gridCfg);
        me.filterCfg = Ext.Object.merge({
            layout: {
                type: 'column'
            },
            defaults: {
                width: 250,
                isLike: false,
                margin: '5 0',
                labelWidth: 80
            },
            items: [
                {
                    xtype: 'numberfield',
                    itemId: 'id',
                    fieldLabel: i18n.getKey('id'),
                    name: 'id',
                    isLike: false,
                    hideTrigger: true,
                    minValue: 1
                },
                {
                    xtype: 'textfield',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name',
                },
                {
                    xtype: 'textfield',
                    itemId: 'isoCode2',
                    isLike: false,
                    fieldLabel: i18n.getKey('isoCode') + '(2)',
                    name: 'isoCode2',
                    diyGetValue: function () {
                        var me = this;
                        return me.getValue()?.toUpperCase();
                    }
                },
            ]
        }, me.filterCfg);
        me.callParent(arguments);
    },
});