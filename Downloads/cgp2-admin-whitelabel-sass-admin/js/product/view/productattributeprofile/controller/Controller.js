Ext.define('CGP.product.view.productattributeprofile.controller.Controller', {
    addProfileGroup: function (modifyOrCreate, record, profileStore, skuAttributeStore, allRecords) {
        Ext.create('Ext.window.Window', {
            modal: true,
            layout: 'fit',
            width: 1000,
            title: i18n.getKey(modifyOrCreate) + i18n.getKey('attribute') + i18n.getKey('group'),
            items: [
                Ext.create('CGP.product.view.productattributeprofile.view.EditProfileGroup1', {
                    record: record,
                    profileStore: profileStore,
                    modifyOrCreate: modifyOrCreate,
                    skuAttributeStore: skuAttributeStore,
                    allRecords: allRecords
                })
            ]
        }).show();
    },
    /**
     *
     * @param productId
     * @param grid
     * @param createOrEdit
     * @param id
     * @param sortIndex 排序sortIndex
     */
    editProductAttributeProfile: function (productId, grid, createOrEdit, id, sortIndex) {
        if (Ext.isEmpty(sortIndex)) {
            sortIndex = '';
        }
        var url = path + 'partials/product/view/productattributeprofile/edit.html' + '?productId=' + productId + '&sortIndex=' + sortIndex;
        if (!Ext.isEmpty(id)) {
            url += '&id=' + id;
        }
        JSOpen({
            id: grid.block + '_edit',
            url: url,
            title: i18n.getKey(createOrEdit) + '_' + grid.i18nblock,
            refresh: true
        });
    },
    expandBody: function () {

    },
    saveAttributeProfile: function (data, mask) {
        var me = this, method = "POST", url;
        data.clazz = 'com.qpp.cgp.domain.attributeconfig.AttributeProfile';
        var id = JSGetQueryString('id');
        var jsonData = data;
        /*if(!Ext.isEmpty(data)) {
         try {
         var jsonData = JSON.parse(data);
         } catch(e) {
         Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('illlegal json'));
         mask.hide();// error in the above string (in this case, yes)!
         return;
         }
         }*/
//		object.promotionId = 1;
        url = adminPath + 'api/attributeProfile';
        if (!Ext.isEmpty(id)) {

            jsonData._id = id;
            method = "PUT";
            url = url + "/" + jsonData._id;
        }

        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: jsonData,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        var id = resp.data._id;
                        var htmlUrl = path + "partials/product/view/productattributeprofile/edit.html?productId=" + data.productId +
                            "&id=" + id;
                        JSOpen({
                            id: "productattributeprofile_edit",
                            url: htmlUrl,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('productAttributeProfile'),
                            refresh: true
                        });
                    });
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                mask.hide();
            }
        });
    },
    createDefaultProfile: function (productId, page) {
        var skuAttributeStore = Ext.create("CGP.product.store.SkuAttribute", {
            configurableId: productId
        });
        var skuAttributeIds = [];
        skuAttributeStore.on('load', function (store, records) {
            Ext.each(records, function (record) {
                skuAttributeIds.push(record.getId());
            });
            var jsonData = {
                "clazz": "com.qpp.cgp.domain.attributeconfig.AttributeProfile",
                "name": "defaultProfile",
                "sort": 0,
                "productId": productId,
                "groups": [{
                    "name": "defaultGroup",
                    "sort": 0,
                    "displayName": "defaultGroup",
                    "_id": JSGetCommonKey(),
                    "skuAttributes": skuAttributeIds
                }]
            };
            Ext.Msg.confirm('提示', '是否新建一个新的默认profile？', callback);

            function callback(id) {
                if (id == 'yes') {
                    var url = adminPath + 'api/attributeProfile';
                    JSAjaxRequest(url, 'POST', true, jsonData, null, function (require, success, response) {
                        if (success) {
                            var resp = Ext.JSON.decode(response.responseText);
                            if (resp.success) {
                                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('create') + i18n.getKey('success'), function () {
                                    if (!Ext.isEmpty(page.grid)) {
                                        page.grid.getStore().load();
                                    }
                                });
                            }
                        }
                    }, true);
                }
            }

        })
    }
});
