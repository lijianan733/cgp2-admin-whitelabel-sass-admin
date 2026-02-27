/**
 * Created by nan on 2021/8/24
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.controller.Controller', {
    /**
     *通过mvtId获取到pcs数据
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
    /**
     * 获取mvt，分为pmvt,smvt
     * @param mvtId
     * @param type
     * @returns {string}
     */
    getMVTData: function (mvtId, type) {
        var url = '';
        var result = '';
        if (type == 'com.qpp.cgp.domain.bom.ProductMaterialViewType') {
            url = adminPath + 'api/productMaterialViewTypes/' + mvtId;
        } else if (type == 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType') {
            url = adminPath + 'api/simplifyMaterialViewType/' + mvtId;
        }
        JSAjaxRequest(url, 'GET', false, null, null, function (request, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                result = responseText.data;
            }
        })
        return result;
    },
    /**
     *
     */
    editActionHandler: function (record, pcsData, grid) {
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey(i18n.getKey(record ? 'edit' : 'create')) + i18n.getKey('PCPreSet'),
            items: [
                {
                    xtype: 'editform',
                    pcsData: pcsData,
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.items.items[0];
                        if (form.isValid()) {
                            var data = form.getValue();
                            console.log(data);
                        }
                    }
                }
            }
        });
        win.show();
    },
    /**
     *保存
     */
    savePCPreSet: function (data, grid) {
        var url = adminPath + 'api/themes';
        var method = 'POST';
        if (data._id) {
            method = 'PUT';
            url = url + '/' + data._id;
        }
        grid.setLoading(true);
        setTimeout(function () {
            JSAjaxRequest(url, method, false, data, null, function (require, success, response) {
                grid.setLoading(false);
                if (success) {

                }
                grid.store.load();
            })
        }, 100);
    },
    /**
     * saveMVT
     */
    saveDefaultThemeExpression: function (data, grid, msg) {
        var url = '';
        var type = data.clazz;
        var mvtId = data._id;
        if (type == 'com.qpp.cgp.domain.bom.ProductMaterialViewType') {
            url = adminPath + 'api/productMaterialViewTypes/' + mvtId;
        } else if (type == 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType') {
            url = adminPath + 'api/simplifyMaterialViewType/' + mvtId;
        }
        grid.setLoading(true);
        setTimeout(
            JSAjaxRequest(url, 'PUT', false, data, msg, function (request, success, response) {
                grid.setLoading(false);
            })
        )
    }
})
