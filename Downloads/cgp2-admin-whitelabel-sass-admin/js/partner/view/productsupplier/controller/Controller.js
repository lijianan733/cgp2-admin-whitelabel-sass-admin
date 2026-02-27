Ext.Loader.syncRequire([
    'CGP.country.store.CountryStore',
    'CGP.shippingquotationtemplatemanage.store.ZonesStore',
    'CGP.partner.controller.Controller',
    'CGP.partner.view.enableproductmanage.store.EnableProductStore',
    'partner.productSupplier.view.EditSupplierProductConfig',
    'CGP.common.productsearch.store.PartnerOptionalProductStore'
])
Ext.define('partner.productSupplier.controller.Controller', {
    // 通用方法
    /**
     * 创建字符串格式
     * @color string 字体颜色
     * @isBold boolean 是否加粗
     * @text string 文本
     * @fontSize number 文本大小
     */
    createFont(color, isBold, text, fontSize) {
        var bold = isBold ? 'bold' : 'none';
        var font = fontSize || 12;
        return "<font style= 'font-size:" + font + "px;color:" + color + ";font-weight:" + bold + "'>" + text + '</font>'
    },

    /**
     * 得到一个退货地址组合字符串
     * @jsonData object 退货地址的数据
     */
    getGroupString(jsonData) {
        var newValue = '';
        var group = ['countryName', 'state', 'city', 'suburb', 'streetAddress2', 'streetAddress1', 'mobile', 'firstName', 'lastName'];
        group.forEach(item => jsonData[item] && (newValue += `${jsonData[item]}  `));
        return newValue;
    },

    /**
     * 快速获取同一层级下的组件
     * @comp comp 层级
     * @compItemIds array 组件itemId
     */
    getCompGroup(comp, compItemIds) {
        var compGroup = [];
        compItemIds.forEach(itemId => compGroup.push(comp.getComponent(itemId)));
        return compGroup;
    },


    isPOST: false,
    queryDataId: null,

    // 页面按钮方法
    //保存编辑退货地址的按钮  已完成
    saveEditReturnAddress(btn) {
        var controller = this;
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        var parentComp = win.parentComp;
        var formValue = form.getValues();

        if (form.isValid()) {
            parentComp.formValue = formValue;
            parentComp.setValue(controller.getGroupString(formValue));
            win.close();
        }
    },

    // 添加生产地区管理按钮 与 编辑功能  已完成
    addAddressBtn(isEdit, store, rowIndex) {
        var countryStore = Ext.create('CGP.country.store.CountryStore');
        var zonesStore = Ext.create('CGP.shippingquotationtemplatemanage.store.ZonesStore');
        var statusMethod = {
            true: {
                titlePrefix: 'edit',
                method: 'PUT'
            },
            false: {
                titlePrefix: 'add',
                method: 'POST'
            }
        };
        var createOrEdit = statusMethod[isEdit];
        var storeData = store.proxy.data;
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey(createOrEdit['titlePrefix']) + '_' + i18n.getKey('可支持生产地区'),
            width: 400,
            modal: true,
            layout: 'fit',
            diySetValue: function (data) {
                var me = this;
                var items = me.items.items;
                items.forEach(item => {
                    item.diySetValue ? item.diySetValue(data) : item.setValue(data)
                })
            },
            items: [
                {
                    xtype: 'form',
                    itemId: 'form',
                    layout: 'vbox',
                    defaults: {
                        xtype: 'combo',
                        margin: '10 0 0 10',
                        width: 350
                    },
                    diySetValue: function (data) {
                        var me = this;
                        var items = me.items.items;
                        items.forEach(item => {
                            var name = item.name;
                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name])
                        })
                    },
                    items: [
                        {
                            fieldLabel: i18n.getKey('country') + '/' + i18n.getKey('region'), //国家/地区
                            name: 'country',
                            itemId: 'country',
                            displayField: 'name',
                            valueField: 'name',
                            allowBlank: false,
                            store: countryStore,
                        },
                        {
                            fieldLabel: i18n.getKey('state'), //省份
                            name: 'state',
                            itemId: 'state',
                            store: zonesStore,
                            displayField: 'name',
                            valueField: 'name',
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('city'), //城市
                            name: 'city',
                            itemId: 'city',
                            margin: '10 0 10 10',
                        },
                    ],
                    bbar: ['->',
                        {
                            xtype: 'button',
                            iconCls: "icon_save",
                            text: i18n.getKey('confirm'),
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                var formValue = form.getValues();
                                if (form.isValid()) {
                                    isEdit ? storeData.splice(rowIndex, 1, formValue) : storeData.push(formValue);
                                    store.load();
                                    win.close();
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: "icon_cancel",
                            text: i18n.getKey('cancel'),
                            handler: function (btn) {
                                var win = btn.ownerCt.ownerCt.ownerCt;
                                win.close();
                            }
                        },
                    ]
                }
            ],
        }).show();
        isEdit && win.diySetValue(storeData[rowIndex]);
    },

    // 生产地区管理删除功能  已完成
    removeAddressBtn(view, rowIndex, colIndex, a, b, record, store) {
        Ext.Msg.confirm('提示', '确定删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                store.proxy.data.splice(rowIndex, 1);
                store.load();
            }
        }
    },

    // 产品管理删除按钮 已完成
    removeProductManagementBtn(btn, store) {
        var container = btn.ownerCt.ownerCt;
        var containerItems = container.getComponent('container');
        var grid = containerItems.getComponent('grid');
        var select = grid.getSelectionModel().getSelection();

        select.length > 0 ? Ext.Msg.confirm('提示', '确认删除？', callback) : Ext.Msg.alert('提示', '请选择一条数据!')

        function callback(id) {
            if (id === 'yes') {
                select.forEach(item => {
                    var id = item.data._id
                    var url = adminPath + 'api/productofmanufactures/' + id;
                    JSSetLoading(true);
                    JSAjaxRequest(url, 'DELETE', false, null, i18n.getKey('deleteSuccess'), function (require, success, response) {
                        JSSetLoading(false);
                    })
                })
                store.load();
            }
        }
    },

    // 供应商产品编辑按钮
    editSupplierProductConfigBtn(newData, store, productId, attributeVersionId) {
        var win = Ext.create('partner.productSupplier.view.EditSupplierProductConfig', {
            data: newData,
            productId: productId,
            attributeVersionId: attributeVersionId,
            parentStore: store
        }).show();
        win.diySetValue(newData)
    },

    /**
     * 获取store中isSku为true的数据
     * @param productId 产品id
     */
    getIsSkuData: function (productId, attributeVersionId) {
        var data = [], isSkuArray = [], isSelectType = [];
        var url = adminPath + 'api/products/configurable/' + productId + '/skuAttributes';
        if (attributeVersionId) {
            url += `?filter= [{"value":${attributeVersionId},"type":"number","name":"versionedAttribute._id"}]`;
        }
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var response = Ext.JSON.decode(response.responseText);
                response.success && (data = response.data);
            }
        })
        data.forEach(item => item['isSku'] && isSkuArray.push(item));
        isSkuArray.forEach(item => item.attribute.selectType !== 'NON' && isSelectType.push(item));
        return isSelectType;
    },
    /**
     * v1还是用旧的取值方式，
     * @param version
     */
    getMVTData: function (version, productId, productConfigDesignId) {
        var allMVTData = [];
        var url = '';
        if (version == 'v1') {
            url = adminPath + `api/productMaterialViewTypes/product/${productId}?&id=${productId}&page=1&start=0&limit=25`;
        } else if (version == 'v2') {
            url = adminPath + `api/materialMvts/productConfigDesign/${productConfigDesignId}/getAllMvt`;
        }
        JSAjaxRequest(url, 'GET', false, false, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    if (responseText?.data?.content) {
                        allMVTData = responseText.data.content;
                    } else {
                        allMVTData = responseText.data;
                    }
                }
            }
        });
        return allMVTData;
    },
    /**
     * 根据pmvt,mmvt获取pcs数据
     * @param pmvtId
     * @returns {null}
     */
    getPCSData: function (mvtId) {
        var result = null;
        var url = adminPath + 'api/pagecontentpreprocess/' + mvtId + '/pageContentSchema';
        JSAjaxRequest(url, 'GET', false, null, null, function (request, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                result = responseText.data;
            }
        })
        return result;
    },
})
