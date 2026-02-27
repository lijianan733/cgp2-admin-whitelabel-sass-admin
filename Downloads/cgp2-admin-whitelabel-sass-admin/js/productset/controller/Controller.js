/**
 * Created by nan on 2021/4/6
 */
Ext.define('CGP.productset.controller.Controller', {
    /**
     *
     */
    saveProductSet: function (data, outPanel) {
        var treePanel = outPanel.treePanel || outPanel.getComponent('leftTree');//新建和编辑centerPanel的外围容器不同
        var id = data.id;
        var method = 'PUT';
        var msg = i18n.getKey('modifySuccess');
        var url = adminPath + 'api/productsets/' + id;
        if (Ext.isEmpty(id)) {
            url = adminPath + 'api/productsets';
            method = 'POST';
            msg = i18n.getKey('addsuccessful');
        }
        JSAjaxRequest(url, method, false, data, msg, function (require, success, response) {
            if (success == true) {
                var responseText = Ext.JSON.decode(response.responseText);
                var data = responseText.data;
                if (method == "POST") {
                    var outPanel = treePanel.ownerCt;
                    outPanel.unmask();
                    outPanel.setValue(data);
                } else {
                    var node = treePanel.store.getNodeById(id);
                    for (var i in data) {
                        //产品套件没用模型
                        node.raw = data;
                        node.set(i, data[i])
                    }
                }
            }
        })
    },
    saveProductSetItem: function (data, outPanel) {
        var treePanel = outPanel.getComponent('leftTree');
        var id = data._id;
        var ulr = adminPath + 'api/productsetitems/' + id;
        var method = 'PUT';
        JSAjaxRequest(ulr, method, false, data, i18n.getKey('modifySuccess'), function (require, success, response) {
            if (success == true) {
                var node = treePanel.store.getNodeById(id);
                var parentNode = node.parentNode;
                treePanel.refreshTreeNode(parentNode, id);
            }
        })
    },
    saveProductScope: function (data, outPanel) {
        var treePanel = outPanel.getComponent('leftTree');
        var id = data._id;
        var ulr = adminPath + 'api/productscopes/' + id;
        var method = 'PUT';
        JSAjaxRequest(ulr, method, false, data, i18n.getKey('modifySuccess'), function (require, success, response) {
            if (success == true) {
                var node = treePanel.store.getNodeById(id);
                var parentNode = node.parentNode;
                treePanel.refreshTreeNode(parentNode, id);
            }
        })

    },
    saveData: function (data, centerPanel) {
        var outPanel = centerPanel.ownerCt;
        var controller = this;
        if (data.clazz == 'com.qpp.cgp.domain.productssuit.ConfigurableProductSet'
            || data.clazz == 'com.qpp.cgp.domain.productssuit.SkuProductSet') {
            controller.saveProductSet(data, outPanel);
        } else if (data.clazz == 'com.qpp.cgp.domain.productssuit.CompleteSetItem'
            || data.clazz == 'com.qpp.cgp.domain.productssuit.MultiSetItem'
            || data.clazz == 'com.qpp.cgp.domain.productssuit.SingleSetItem') {
            controller.saveProductSetItem(data, outPanel);

        } else if (data.clazz == 'com.qpp.cgp.domain.productssuit.StaticProductScope'
            || data.clazz == 'com.qpp.cgp.domain.productssuit.MainCategoryProductScope'
            || data.clazz == 'com.qpp.cgp.domain.productssuit.SubCategoryProductScope') {
            controller.saveProductScope(data, outPanel);
        }
        if (centerPanel.ownerCt && centerPanel.ownerCt.xtype == 'window') {
            centerPanel.ownerCt.close();
        }
    }
})