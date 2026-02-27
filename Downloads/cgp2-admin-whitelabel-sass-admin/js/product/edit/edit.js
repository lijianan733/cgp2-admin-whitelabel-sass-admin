Ext.onReady(function () {


    var page = new Ext.container.Viewport({
        title: 'Create Product',
        layout: 'border'
    });

    var status = 'creating';
    var data;
    var id = Ext.urlDecode(location.search.substring(1))['id'];
    window.productId = id;
    if (id) {
        id = Ext.Number.from(id, 0);
        //如果是编辑模式     就通过Ajax.request加载这个产品的信息
        if (id != 0) {
            status = 'editing';
            var mask = page.setLoading();
            var requestParam = {
                method: 'GET',
                url: adminPath + 'api/products/' + id,
                async: false,
                params: {
                    access_token: Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    //data 是一条id为id的产品信息数据
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        data = resp.data;
                        //以data中的website来加载    这个网站的产品类目树store  root节点已建好
                        subProductCategoryStore = Ext.create('CGP.common.store.ProductCategory', {
                            storeId: "subProductCategoryStore",
                            nodeParam: 'id',
                            params: {
                                website: data.mainCategory.website,
                                isMain: false,
                                limit: 25
                            },
                            listeners: {
                                load: function (store, node, recrods) {
                                    recrods.forEach(function (record) {
                                        record.set('checked', false);
                                    })

                                }
                            }
                        });

                    }
                    else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                },
                callback: function () {
                    mask.hide();
                }
            };
            Ext.Ajax.request(requestParam);
        }

    } else {
        //新建模式   就加载website id为9的网站的产品类目树store
        subProductCategoryStore = Ext.create('CGP.common.store.ProductCategory', {
            storeId: "subProductCategoryStore",
            params: {
                website: 11,
                isMain: false,
                limit: 25
            },
            listeners: {
                load: function (store, node, recrods) {
                    recrods.forEach(function (record) {
                        record.set('checked', false);
                    })
                }
            },
            autoLoad: true
        });
    }
    var controller = Ext.create("CGP.product.edit.controller.Controller");
    controller.initPanel(page, data);
    //initController(window, page,  data);
});
