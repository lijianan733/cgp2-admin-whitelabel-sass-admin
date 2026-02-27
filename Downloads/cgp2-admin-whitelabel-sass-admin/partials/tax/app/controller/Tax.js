/**
 * Tax
 * @Author: C-1316
 * @Date: 2021/11/2
 */
Ext.Loader.setPath('Ext.ux', path + 'ClientLibs/extjs/ux');
Ext.define('CGP.tax.controller.Tax', {
    extend: 'Ext.app.Controller',
    requires: [
        "CGP.tax.common.CountryCombo",
        "CGP.tax.common.StateCombo"
    ],
    stores: [
        'Tax'
    ],
    models: ['Tax'],
    views: [
        // 'Main',
        'Edit',
        'TaxRule',
        'AreaTax',
        'Area',
        'AreaTaxGrid',
        'AreaTaxMain',
        "productcategory.ProductCategory",
        'productcategory.LeftCategory',
        'productcategory.LeftCategoryQuery',
        "productcategory.CategoryGrid",
        "productcategory.CategoryEdit",
        "productcategory.CenterProduct",

        "productcategory.CategoryTax",
        "productcategory.CategoryTaxRule"
    ],
    init: function () {
        this.control({
            // 'viewport grid button[itemId=createbtn]': {
            //     click: this.editRGB
            // },
            'form [itemId="taxSave"]': {
                click: this.saveTax
            },
            'panel [itemId="categoryGrid"]': {
                select: this.selectCategory
            }
        });
    },
    selectCategory: function (rowModel, CategoryRcd, index, eOpts) {
        var categoryGrid = rowModel.view.ownerCt;
        var selecteds = categoryGrid.getSelectionModel().getSelection();
        if (selecteds.length > 1) {
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('一次只能选中一条数据!'));
            return false;
        }
        if (categoryGrid.isView) {
            var centerPanel = categoryGrid.ownerCt.down('categorytaxrule');
            var me = this;
            centerPanel.categoryId = CategoryRcd.get("_id");
            centerPanel.down('toolbar [itemId="saveBtn"]').show();
            centerPanel.down('areatax').show();
            centerPanel.data = {};
            centerPanel.down('areatax').reset();
            centerPanel.CategoryRcd = CategoryRcd;
            me.getCategoryTax(centerPanel, CategoryRcd.get("_id"), categoryGrid);
        } else {
            var centerPanel = categoryGrid.ownerCt.ownerCt.down('centerproduct');
            var productStore = centerPanel.down('grid').store;
            centerPanel.categoryId = CategoryRcd.get('_id')
            productStore.proxy.url = adminPath + 'api/productoftax/' + CategoryRcd.get('_id') + '/exists/products';
            productStore.load();
            centerPanel.down('uxfilter').reset();
            centerPanel.down('toolbar').getComponent('productAddBtn').enable();
            centerPanel.down('toolbar').getComponent('productDeleBtn').enable();
        }
    },

    getCategoryTax: function (centerPanel, CategoryId, categoryGrid) {
        var areaTaxId = categoryGrid.areaTax?._id;
        var url = adminPath + 'api/areacategorytax', method = 'GET';
        var optins = {
            url: encodeURI(url),
            method: method,
            async: true,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    if (resp.data?.content[0]) {
                        centerPanel.setValue(resp.data?.content[0]);
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            },
            callback: function (require, success, response) {

            }
        };
        optins.params = {
            page: 1,
            start: 0,
            limit: 25,
            filter: '[{"name": "category._id",  "value": "' + CategoryId + '", "type": "string" },{"name": "areaTax._id",  "value": "' + areaTaxId + '", "type": "string" }]'
        };
        Ext.Ajax.request(optins);
    },

    /**
     * 保存税种
     * @param btn
     * @returns {boolean}
     */
    saveTax: function (btn) {
        var me = this;
        var form = btn.ownerCt.ownerCt;
        if (!form.isValid()) {
            return false;
        }
        var data = form.diyGetValue();
        var url = adminPath + 'api/tax', method = 'POST';
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                form.createOrEdit = 'edit';
                form.diySetValue(resp.data);
                //添加成功后批量添加AreaTax
                me.batchAddAreaTax({
                    "areaTaxes": data.areaTax,
                    "taxId": resp.data?._id
                });
            }
        };
        if (form.createOrEdit == 'edit') {
            method = 'PUT';
            url += '/' + data._id;
            //修改回调函数不用调批量添加
            callback = function (require, success, response) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    form.createOrEdit = 'edit';
                    form.data = resp.data;
                }
            };
        }

        JSAjaxRequest(url, method, true, data, i18n.getKey('save') + i18n.getKey('success'), callback)
    },

    batchAddAreaTax: function (data) {
        var url = adminPath + 'api/areatax/batch', method = 'POST';
        Ext.Ajax.request({
            url: encodeURI(url),
            method: method,
            async: true,
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            },
            callback: function (require, success, response) {
            }
        });
    },
    windAreaTax: function (gri, record, confirmHandler) {
        var areaTaxId = record?.data?._id;
        Ext.create('Ext.ux.window.SuperWindow', {
            height: 460,
            title: (areaTaxId ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('areaTax'),
            confirmHandler: confirmHandler,
            items: [
                {
                    xtype: 'areatax',
                    itemId: 'wform',
                    data: record?.data,
                    border: 0,
                    // country: record?.data?.area?.country,
                    // sourceCountry: record?.data?.sourceArea?.country,
                    // resourceCountry:resourceCountry
                }
            ]
        }).show();
    },
    /**
     * 编辑区域
     * @param grid
     * @param record
     */
    editAreaTax: function (grid, record) {
        var areaTaxId = record?.data?._id, me = this;
        var confirmHandler = null;
        if (Ext.isEmpty(JSGetQueryString('id'))) {
            confirmHandler = function (btn) {
                var wind = btn.ownerCt.ownerCt;
                var form = wind.getComponent('wform');
                if (!form.isValid()) {
                    return false;
                }
                var data = form.getValue();
                data.tax = record.get('tax');
                if (Ext.isEmpty(areaTaxId)) {
                    data._id = JSGetCommonKey();
                    grid.store.add(data);
                } else {
                    for (var k in data) {
                        record.set(k, data[k]);
                    }
                }
                wind.close();
            }
        } else {
            confirmHandler = function (btn) {
                var wind = btn.ownerCt.ownerCt;
                var form = wind.getComponent('wform');
                if (!form.isValid()) {
                    return false;
                }
                var data = form.getValue();
                data.tax = record.get('tax');
                var url = adminPath + 'api/areatax', method = 'POST';
                if (areaTaxId) {
                    method = 'PUT';
                    url += '/' + areaTaxId;
                }
                var callback = function (require, success, response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        wind.close();
                        grid.store.load();
                    }
                };
                JSAjaxRequest(url, method, true, data, i18n.getKey('save') + i18n.getKey('success'), callback)
            }
        }
        me.windAreaTax(grid, record, confirmHandler);
    },

    deleteAreaTax: function (grid) {
        var selecteds = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(JSGetQueryString('id'))) {
            grid.store.remove(selecteds);
        } else {
            var url = adminPath + 'api/areatax/batch', method = 'DELETE', data = [];
            if (selecteds.length > 0) {
                selecteds.forEach(function (item) {
                    data.push(item.get('_id'));
                })
                var callback = function (require, success, response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        grid.store.load();
                    }
                };
                JSAjaxRequest(url, method, true, data, i18n.getKey('delete') + i18n.getKey('success'), callback)

            } else {
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('未选中数据!'));
                return false;
            }
        }
    },
    deleAreaTax: function (grid, record) {
        if (Ext.isEmpty(JSGetQueryString('id'))) {
            grid.store.remove(record);
        } else {
            var url = adminPath + 'api/areatax/' + record.get('_id'), method = 'DELETE';

            var callback = function (require, success, response) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    grid.store.load();
                }
            };
            JSAjaxRequest(url, method, true, null, i18n.getKey('delete') + i18n.getKey('success'), callback);
        }
    },
    /**
     * 创建添加可以产品的弹窗
     * @param categoryId
     * @param store
     */
    addProductWindow: function (categoryId, store) {
        var me = this;
        var wind = Ext.create('CGP.common.productsearch.ProductSearchWin', {
            width: 1000,
            height: 700,
            title: i18n.getKey('enabelProductGrid'),
            filterCfg: {
                height: 120,
                skuFilter: {},
                //typeFilter: { xtype: 'combo', value: 'SKU', hidden: true},
                websiteFilter: {hidden: true},
                categoryId: categoryId
            },
            bbarCfg: {
                btnConfirm: {
                    iconCls: 'icon_agree',
                    handler: function () {
                        var window = this.ownerCt.ownerCt;
                        var records = this.ownerCt.ownerCt.getSelection();
                        var productIds = [];
                        for (var i = 0; i < records.length; i++) {
                            productIds.push(records[i].getId());
                        }
                        if (records.length > 0) {
                            var url = adminPath + 'api/productoftax/' + categoryId + '/products', method = 'POST';
                            var callback = function (require, success, response) {
                                var response = Ext.JSON.decode(response.responseText)
                                if (response.success) {
                                    store.load();
                                    wind.close();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            };
                            JSAjaxRequest(url, method, true, productIds, i18n.getKey('add') + i18n.getKey('success'), callback);

                        } else {
                            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('未选中数据!'));
                        }
                    }
                },

                btnCancel: {
                    hidden: true
                }
            },
            grid: {},
            gridCfg: {
                viewConfig: {
                    enableTextSelection: true//设置grid中的文本可以选择
                },
                store: Ext.create('CGP.tax.store.OptionalProducts', {
                    categoryId: categoryId
                })
            }
        });
        wind.show();
    },

    /**
     * 分类下批量删除已选产品
     * @param gridPanel
     * @returns {boolean}
     */
    deleteSelectProducts: function (gridPanel) {
        var me = this, grid = gridPanel.down('grid');
        var productIds = [], selecteds = grid.getSelectionModel().getSelection();
        if (selecteds && selecteds.length > 0) {
            selecteds.forEach(function (item) {
                productIds.push(item.get('id'));
            })
            me.deleteProducts(grid.store, gridPanel.categoryId, productIds);
        } else {
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('未选中数据!'));
            return false;
        }
    },
    /**
     * 分类下删除已选产品
     * @param store
     * @param categoryId
     * @param productIds
     */
    deleteProducts: function (store, categoryId, productIds) {
        var url = adminPath + 'api/productoftax/' + categoryId + '/products', method = "DELETE";
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                store.load();
            }
        };
        JSAjaxRequest(url, method, true, productIds, i18n.getKey('delete') + i18n.getKey('success'), callback)
    },
    /**
     * 编辑计税产品分类
     * @param grid
     * @param record
     */
    editCatetory: function (grid, record) {
        var catetoryId = record?.data?._id;
        Ext.create('Ext.ux.window.SuperWindow', {
            height: 200,
            title: (catetoryId ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('productcategory'),
            confirmHandler: function (btn) {
                var wind = btn.ownerCt.ownerCt;
                var form = wind.getComponent('wform');
                if (!form.isValid()) {
                    return false;
                }
                var data = form.getValue();
                var url = adminPath + 'api/taxproductcategory', method = 'POST';
                if (catetoryId) {
                    method = 'PUT';
                    url += '/' + catetoryId;
                }
                var callback = function (require, success, response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        grid.store.load();
                        wind.close();
                    }
                };
                JSAjaxRequest(url, method, true, data, i18n.getKey('save') + i18n.getKey('success'), callback)
            },
            items: [
                {
                    xtype: 'categoryedit',
                    itemId: 'wform',
                    data: record?.data,
                }
            ]
        }).show();
    },

    /**
     * 删除计税产品分类
     * @param grid
     * @param record
     * @returns {boolean}
     */
    deleteCatetory: function (grid, record) {
        if (record) {
            var url = adminPath + 'api/taxproductcategory/' + record.get("_id"),
                method = 'DELETE', data = {};
            var callback = function (require, success, response) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('删除成功!'));
                    grid.store.load();
                }
            };
            JSAjaxRequest(url, method, true, data, i18n.getKey('save') + i18n.getKey('success'), callback)

        } else {
            Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('未选中数据!'));
            return false;
        }

    },

    saveCatetoryTax: function (taxRulePanel) {
        if (!taxRulePanel.isValid()) {
            return false;
        }
        var data = taxRulePanel.getValue();
        var categoryGrid = taxRulePanel.ownerCt.getComponent('categoryGrid')
        if (taxRulePanel.categoryId) {
            data.category = {
                "_id": taxRulePanel.categoryId,
                "clazz": 'com.qpp.cgp.domain.tax.AreaCategoryTax'
            };
        }
        if (taxRulePanel.areaTax) {
            data.areaTax = {
                "_id": taxRulePanel.areaTax._id,
                "clazz": taxRulePanel.areaTax.clazz
            };
        }
        var url = adminPath + 'api/areacategorytax', method = 'POST';
        if (data._id) {
            method = 'PUT';
            url += '/' + data._id;
        }
        data.threshold = data.amountThreshold;
        var callback = function (require, success, response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                taxRulePanel.setValue(resp.data);
                taxRulePanel.CategoryRcd.set('existsAreaCategoryTax', true);
                // categoryGrid.store.load();
            }
        };
        JSAjaxRequest(url, method, true, data, i18n.getKey('save') + i18n.getKey('success'), callback)
    },

    categoryTaxWind: function (taxId, areaTax, fromTax) {
        var title = Ext.String.format('{0}({1}){2}{3}', i18n.getKey('tax'), taxId, i18n.getKey('productcategory'), i18n.getKey('taxRule'));
        if (!fromTax) {
            title = Ext.String.format('{0}({1}){2}{3}', i18n.getKey('areaTax'), areaTax._id, i18n.getKey('productcategory'), i18n.getKey('taxRule'));
        }
        var wind = Ext.create('Ext.ux.window.SuperWindow', {
            width: 1000,
            height: 700,
            bodyPadding: 0,
            title: title,
            isView: true,
            data: null,
            receiver: null,
            confirmHandler: null,
            items: [{
                xtype: 'categorytax',
                id: 'categoryTax',
                title: i18n.getKey('product') + i18n.getKey('category') + i18n.getKey('taxRule'),
                header: false,
                // closable: true,
                taxId: taxId,
                areaTax: areaTax,
                // areaTaxId: areaTaxId,

            }]
        });
        wind.show();
    },

    /**
     * 显示右键菜单
     * @param view
     * @param record
     * @param e
     */
    categoryEventMenu: function (view, record, e) {
        var me = this;
        var grid = view.ownerCt;
        var centerPanel=grid.ownerCt.down('categorytaxrule');
        if(Ext.isEmpty(centerPanel.data?._id)){
            return false;
        }
        e.stopEvent();
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                // {
                //     text: i18n.getKey('modify') + i18n.getKey('name'),
                //     disabledCls: 'menu-item-display-none',
                //     itemId: 'modifyName',
                //     handler: function () {
                //         me.editTag(grid, record)
                //     }
                // },
                {
                    text: i18n.getKey('delete')+i18n.getKey('category') + i18n.getKey('taxRule'),
                    disabledCls: 'menu-item-display-none',
                    // hidden: record.get('leaf'),
                    itemId: 'delete',
                    handler: function (btn) {
                        me.deleteCategoryTax(centerPanel, record)
                    }
                },
            ]
        });

        menu.showAt(e.getXY());

    },
    deleteCategoryTax:function (centerPanel,record){
        Ext.Msg.confirm(i18n.getKey('prompt'),i18n.getKey('category') + i18n.getKey('tax')+i18n.getKey('deleteConfirm'), function (opt) {
            if (opt == 'yes') {
                var url = adminPath + 'api/areacategorytax/' + centerPanel.data._id, method = 'DELETE';
                var callback = function (require, success, response) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        centerPanel.data = {
                            sourceArea: centerPanel.areaTax?.sourceArea,
                            area: centerPanel.areaTax?.area
                        };
                        centerPanel.setValue(centerPanel.data);
                        record.set("existsAreaCategoryTax", false);
                    }
                };
                JSAjaxRequest(url, method, true, null, i18n.getKey('category') + i18n.getKey('taxRule') + i18n.getKey('delete') + i18n.getKey('success'), callback);
            }
        })
    }
});


