/**
 * Created by nan on 2021/8/24
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.controller.Controller', {
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
     *新建或编辑PC内容预设
     */
    editPCPreSet: function (record, pcsData, uxgrid) {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            layout: 'fit',
            title: i18n.getKey(i18n.getKey(record ? 'edit' : 'create')) + i18n.getKey('PCPreSet'),
            items: [
                {
                    xtype: 'editform',
                    pcsData: pcsData,
                    mvtType: JSGetQueryString('mvtType'),
                    mvtId: JSGetQueryString('mvtId'),
                    recordData: record ? record.getData() : null
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
                            controller.savePCPreSet(data, uxgrid);
                            win.close();
                        }
                    }
                }
            }
        });
        win.on('afterrender', function () {
            var win = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            win.productId = productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                var toolbar = win.getDockedItems('toolbar[dock="bottom"]')[0];
                toolbar.hide();
            }
        })
        win.show();

    },
    /**
     *保存
     */
    savePCPreSet: function (data, grid) {
        var url = adminPath + 'api/pcResourceContents';
        var method = 'POST';
        if (data._id) {
            method = 'PUT';
            url = adminPath + 'api/pcResourceContents' + '/' + data._id;
        }
        grid.el.mask('加载中..');
        setTimeout(function () {
            JSAjaxRequest(url, method, false, data, null, function (require, success, response) {
                grid.el.unmask('加载中..');
                if (success) {
                    grid.grid.store.load();
                }
            })
        }, 300);
    }
})
