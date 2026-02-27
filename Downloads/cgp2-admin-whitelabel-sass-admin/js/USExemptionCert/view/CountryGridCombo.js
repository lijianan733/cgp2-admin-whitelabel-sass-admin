/**
 * @Description:
 * @author nan
 * @date 2023/8/7
 */
Ext.define("CGP.USExemptionCert.view.CountryGridCombo", {
    extend: "Ext.form.field.GridComboBox",
    alias: 'widget.country_gridcombo',
    editable: false,
    matchFieldWidth: false,
    multiSelect: false,
    autoScroll: true,
    store: null,
    displayField: 'countryName',
    valueField: 'countryCode',
    diyGetValue: function () {
        var me = this;
        return me.getArrayValue();
    },
    initComponent: function () {
        var me = this;
        var store = me.store = Ext.create('Ext.data.Store', {
            fields: [
                'countryCode', 'countryName'
            ],
            pageSize: 1000,
            proxy: {
                extraParams: Ext.JSON.encode([{name: 'certType', type: 'string', value: 'VATID'}]),
                type: 'uxrest',
                url: adminPath + 'api/locationSaleCertRequirements',
                reader: {
                    type: 'json',
                    root: 'data.content[0].locations'
                }
            },
            sorters: {property: 'countryName', direction: 'ASC'},
        })
        me.gridCfg = Ext.Object.merge({
            store: store,
            height: 450,
            width: 550,
            autoScroll: true,
            columns: [
                {
                    text: i18n.getKey('国家/地区的名称'),
                    flex: 1,
                    dataIndex: 'countryName'
                },
                {
                    text: i18n.getKey('国家/地区的代码'),
                    flex: 1,
                    dataIndex: 'countryCode'
                },
            ],
            tbar: [
                {
                    xtype: 'trigger',
                    flex: 1,
                    itemId: 'nameSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    emptyText: '名称本地查询',
                    onTrigger1Click: function () {//按钮操作
                        var me = this;
                        var grid = me.ownerCt.ownerCt;
                        me.reset();
                        grid.store.clearFilter();
                    },
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var grid = me.ownerCt.ownerCt;
                        var value = me.getValue();
                        if (value) {
                            grid.store.clearFilter();
                            grid.store.filter(function (params) {
                                var regex = new RegExp(value, 'i');
                                return regex.test(params.get('countryName'));
                            });
                        } else {
                            me.onTrigger1Click();
                        }
                        this.focus();
                    },
                    listeners: {
                        afterrender: function () {
                            this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                                enter: function () {
                                    this.onTrigger2Click();
                                    this.focus();
                                }, scope: this
                            });
                        },
                        change: function () {
                            var me = this;
                            me.onTrigger2Click()
                        }
                    }
                },
                {
                    xtype: 'trigger',
                    flex: 1,
                    itemId: 'codeSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    emptyText: '代码本地查询',
                    onTrigger1Click: function () {//按钮操作
                        var me = this;
                        var grid = me.ownerCt.ownerCt;
                        me.reset();
                        grid.store.clearFilter();
                    },
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var grid = me.ownerCt.ownerCt;
                        var value = me.getValue();
                        if (value) {
                            grid.store.clearFilter();
                            grid.store.filter(function (params) {
                                var regex = new RegExp(value, 'i');
                                return regex.test(params.get('countryCode'));
                            });
                        } else {
                            me.onTrigger1Click();
                        }
                        this.focus();
                    },
                    listeners: {
                        afterrender: function () {
                            this.keyNav = Ext.create('Ext.util.KeyNav', this.el, {
                                enter: function () {
                                    this.onTrigger2Click();
                                }, scope: this
                            });
                        },
                        change: function () {
                            var me = this;
                            me.onTrigger2Click()
                        }
                    }
                }
            ]
        }, me.gridCfg);
        me.callParent(arguments);
    },
});
