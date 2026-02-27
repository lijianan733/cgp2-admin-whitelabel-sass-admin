/**
 * Main
 * @Author: miao
 * @Date: 2021/11/2
 */
Ext.define('CGP.tax.view.Main', {
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.taxmain',
    config: {
        i18nblock: i18n.getKey('tax'),
        block: 'tax/app/view',
        editPage: 'edit.html',
        //权限控制
        //accessControl: true,

        gridCfg: {
            store: 'Tax',
            columns: [
                {
                    text: i18n.getKey('operation'),
                    dataIndex: '_id',
                    xtype: 'componentcolumn',
                    width: 100,
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('categoryManage'),
                                                itemId: 'categoryManage',
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    JSOpen({
                                                        id: 'taxProductCategory',
                                                        url: path + "partials/tax/app/view/productcategory/productcategory.html?taxId=" + record.get('_id'),
                                                        title: Ext.String.format('{0}({1}){2}',i18n.getKey('tax'),record.get('_id'), i18n.getKey('productcategory'))
                                                    });
                                                }
                                            }
                                        ],
                                        listeners: {
                                            beforeshow: {
                                                fn: function (menu) {
                                                    menu.add(
                                                        [
                                                            {
                                                                text: i18n.getKey('areaTax'),
                                                                disabledCls: 'menu-item-display-none',
                                                                itemId:'areaTax',
                                                                handler: function () {
                                                                    // windows.
                                                                    JSOpen({
                                                                        id: 'areaTaxMain',
                                                                        url: path + "partials/tax/app/view/areataxmain.html?id=" + record.get('_id')+"&countryId="+(record.get('area'))?.country?.id+"&countryName="+(record.get('area'))?.country?.name +"&souCountryId="+(record.get('rootAreaTax'))?.sourceArea?.country?.id+"&souCountryName="+(record.get('rootAreaTax'))?.sourceArea?.country?.name,
                                                                        title:Ext.String.format('{0}({1}){2}', i18n.getKey('tax'),record.get('_id'),i18n.getKey('areaTax'))
                                                                    });

                                                                }
                                                            },
                                                            {
                                                                text: i18n.getKey('product') + i18n.getKey('category')+i18n.getKey('taxRule'),
                                                                itemId:'categoryTaxRule',
                                                                disabledCls: 'menu-item-display-none',
                                                                handler: function () {
                                                                    // top.remove('categoryTax');
                                                                    // JSOpen({
                                                                    //     xtype:'categorytax',
                                                                    //     id: 'categoryTax',
                                                                    //     title: i18n.getKey('product') + i18n.getKey('category')+i18n.getKey('taxRule'),
                                                                    //     closable: true,
                                                                    //     taxId: record.get('_id'),
                                                                    //     areaTax:record.get('rootAreaTax'),
                                                                    //     fromArea:false,
                                                                    //
                                                                    // }
                                                                    // );
                                                                    var controller = Ext.create('CGP.tax.controller.Tax');
                                                                    controller.categoryTaxWind(record.get('_id'),record.get('rootAreaTax'),true);
                                                                }
                                                            }
                                                        ]
                                                    );
                                                }, single: true
                                            }
                                        }
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    sortable: true,
                    width: 100
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('taxbase'),
                    dataIndex: 'base',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var displayValue=i18n.getKey('sellPrice');
                        if(value=='RESALE_PRICE'){
                            displayValue=i18n.getKey('resalePrice');
                        }
                        metadata.tdAttr = 'data-qtip="' + displayValue + '"';
                        return displayValue;
                    }
                },
                {
                    text: i18n.getKey('country'),
                    dataIndex: 'area',
                    xtype: 'gridcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        var country=value?.country.name||'';
                        metadata.tdAttr = 'data-qtip="' + country + '"';
                        return country;
                    }
                },
                {
                    text: i18n.getKey('taxRule'),
                    dataIndex: 'rootAreaTax',
                    xtype: 'componentcolumn',
                    width: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-taxRule" style="color: blue">查看</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-taxRule');
                                    clickElement.addEventListener('click', function () {
                                        Ext.create('Ext.ux.window.SuperWindow',{
                                            title:Ext.String.format('{0}({1}){2}',record.get('name'),record.get('_id'),i18n.getKey('taxRule')),
                                            isView:true,
                                            height: 460,
                                            items: [{
                                                xtype:'areatax',
                                                readOnly:true,
                                                border:0,
                                                listeners: {
                                                    afterrender: {
                                                        fn: function (comp) {
                                                            if (record.data?.rootAreaTax) {
                                                                comp.setValue(record.data?.rootAreaTax);
                                                            }
                                                            if(comp.readOnly){
                                                                comp.setReadOnly();
                                                            }
                                                        }, single: true
                                                    }
                                                },
                                            },]
                                        }).show();
                                    },false);

                                }
                            }
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    hideTrigger: true,
                    listeners: {
                        render: function (comp) {
                            var searchId = JSGetQueryString('taxId');
                            if (searchId) {
                                comp.setValue(searchId);
                            }
                        }
                    }
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    itemId: 'nameSearch',
                    fieldLabel: i18n.getKey('name'),
                },
                {
                    name: 'area.country.id',
                    xtype: 'countrycombo',
                    itemId: 'countrySearch',
                    fieldLabel: i18n.getKey('country'),
                    displayField: 'name',
                    valueField: 'id',
                    haveReset:true,
                    store:Ext.create('CGP.country.store.CountryStore'),
                    diyGetValue:function (){
                        var comp=this,data=null;
                        data=comp.getArrayValue();
                        if(data){
                            return data[comp.valueField];
                        }
                        else{
                            return null;
                        }
                    }
                }
            ]
        }
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
});