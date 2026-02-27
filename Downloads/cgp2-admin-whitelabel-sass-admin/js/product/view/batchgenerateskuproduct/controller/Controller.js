/**
 * Created by nan on 2018/6/27.
 */
Ext.define('CGP.product.view.batchgenerateskuproduct.controller.Controller', {
    /**
     * 不懂为啥要建成树形结构
     * @param form
     * @param n
     * @param parent
     * @param attributeObj
     */
    /* createTreeData: function (form, n, parent, attributeObj) {
     var children = parent.children;
     var addChildNode = function (item, field, node) {
     if (field.xtype == 'checkboxgroup') {
     Ext.Array.each(item.attribute.options, function (options) {
     var child = {
     attributeId: item.attribute.id,
     attributeName: item.displayName,
     optionId: options.id,
     children: [],
     optionName: options.name,
     leaf: true
     };
     node.children.push(child);
     if (i < attributeObj.length - 1) {
     child.children = [];
     child.leaf = false;
     }
     });
     } else {
     var child = {
     attributeId: item.attribute.id,
     attributeName: item.displayName,
     optionId: null,
     children: [],
     optionName: field.getValue(),
     leaf: true
     };
     node.push(child);
     if (i < attributeObj.length - 1) {
     child.children = [];
     child.leaf = false;
     }
     }
     return node.children;
     }
     var needAddChildNode = [parent];
     for (var i = 0; i < attributeObj.length; i++) {
     var item = attributeObj[i];
     var field = form.getComponent(item.displayName);
     for (var j = 0; j < needAddChildNode.length; j++) {
     addChildNode(item, field, needAddChildNode[j]);
     }
     }
     console.log(parent);
     },*/

    createTreeData: function (form, n, parent, attributeObj) {
        var me = this;
        //查找选中的选项的序号
        var findSelectedOptions = function (optionsName, optionsArray) {
            var index = null;
            for (index = 0; index < optionsArray.length; index++) {
                if (optionsName == optionsArray[index].name) {
                    return index;
                }
            }
        }
        Ext.Array.each(form.items.items[n], function (item, index) {
            if (item.xtype == 'checkboxgroup') {//选项
                for (var i = 0; i < item.getChecked().length; i++) {
                    var index = findSelectedOptions(item.getChecked()[i].inputValue, attributeObj[n].attribute.options);
                    var child = {
                        attributeId: attributeObj[n].attribute.id,
                        attributeName: attributeObj[n].displayName,
                        optionId: attributeObj[n].attribute.options[index].id,
                        children: [],
                        optionName: attributeObj[n].attribute.options[index].id,
                        leaf: true
                    }
                    parent.children.push(child);
                    if (n < attributeObj.length - 1) {
                        child.children = [];
                        child.leaf = false;
                        me.createTreeData(form, n + 1, child, attributeObj)
                    }
                }
            } else {//输入
                var child = {
                    attributeId: attributeObj[n].attribute.id,
                    attributeName: attributeObj[n].displayName,
                    optionId: null,
                    children: [],
                    optionName: form.items.items[n].getValue(),
                    leaf: true
                };
                parent.children.push(child);
                if (n < attributeObj.length - 1) {
                    child.children = [];
                    child.leaf = false;
                    me.createTreeData(form, n + 1, child, attributeObj)
                }
            }
        });

    },
    /**
     * 创建所有属性组合的可能
     * @param root
     * @returns {Array}
     */
    createAttributeValues: function (root) {
        var me = this;

        function depthFirstPreOrder(node, paths, position) {
            var i, count, path;
            var children = node.children;
            if (children.length > 0) {
                for (i = 0, count = children.length; i < count; i++) {
                    var child = children[i];
                    if (i > 0) {
                        position.pop();
                    }
                    position.push(child);
                    depthFirstPreOrder(child, paths, position);
                    if (i == count - 1) {
                        position.pop();
                    }
                }
            } else {
                var data = [];
                Ext.Array.each(position, function (item) {
                    var a = {};
                    a.id = item.attributeId;
                    a.value = item.optionId ? parseInt(item.optionId) : item.optionName;
                    data.push(a);
                });
                paths.push(data);
            }
        }

        var paths = new Array(), position = new Array();
        depthFirstPreOrder(root, paths, position);
        return paths;
    },
    /**
     * 发送批量请求
     * @param form
     * @param paths
     * @param productId
     */
    batchGenerateSkuProduct: function (form, paths, productId) {
        var myMask = new Ext.LoadMask(form, {
            msg: "加载中..."
        })
        var successCount = 0;
        var requestCount = paths.length;
        /*  Ext.Msg.progress(i18n.getKey('batch') + i18n.getKey('generate') + i18n.getKey('skuProduct'), successCount / requestCount * 100 + '%', successCount / requestCount * 100 + '%');
         var timeOut = 1;*/

        myMask.show(null, function () {
            setTimeout(function () {
                Ext.Array.each(paths, function (itemo) {
                    var requestConfig = {
                        url: adminPath + 'api/products/' + productId + '/generateSkuProduct',
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                        },
                        jsonData: {skuAttributeValues: itemo},
                        success: function (response) {
                            var resp = eval('(' + response.responseText + ')');
                            successCount++;
                            var responseMessage = Ext.JSON.decode(response.responseText);
                            if (responseMessage.success) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('addsuccessful'));
                                if (successCount == paths.length) {
                                    myMask.hide();
                                    Ext.Msg.confirm(i18n.getKey('prompt'), '查看生成的sku产品:'+responseMessage.data.id+ '？', function (btn) {
                                        if (btn === 'yes') {
                                            JSOpen({
                                                id: 'productpage',
                                                url: path + "partials/product/product.html?id=" + responseMessage.data.id ,
                                                title: i18n.getKey('product') ,
                                                refresh: true
                                            });
                                        }
                                    })
                                }
                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                if (successCount == paths.length) {
                                    myMask.hide();
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            }
                            /*
                             Ext.Msg.updateProgress(successCount / requestCount, successCount / requestCount * 100 + '%', successCount / requestCount * 100 + '%');
                             */
                        },
                        failure: function (response) {
                            if (successCount == paths.length) {
                                var responseMessage = Ext.JSON.decode(response.responseText);
                                myMask.hide();
                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                            }

                        }
                    };
                    Ext.Ajax.request(requestConfig);
                })
            }, 500);
        });
//使用批量请求组件，不要使用success，和failure配置，该两个配置已经规定好了固定的操作，使用callback配置进行自定义的回调操作
        /*  var recordIdArray = paths;
         var requestConfig = {
         url: adminPath + 'api/products/' + productId + '/skuProduct',
         method: 'POST',
         headers: {
         Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
         },
         callback: function (response, successOrNot) {
        ;
         var resp = eval('(' + response.responseText + ')');
         successCount++;
         Ext.Msg.updateProgress(successCount / requestCount, successCount / requestCount * 100 + '%', '批量生成中...');
         if (successOrNot == false) {
         Ext.Msg.close();
         successCount = 0;
         }
         if (successCount == paths.length) {
         Ext.Msg.confirm(i18n.getKey('prompt'), '共生成' + paths.length + '个sku产品,是否查看所有sku产品？', function (btn) {
         if (btn === 'yes') {
         JSOpen({
         id: 'managerskuattribute',
         url: path + "partials/product/managerskuattribute.html?id=" + productId + '&activeTab=2',
         title: i18n.getKey('managerSkuAttr') + '(' + i18n.getKey('productCode') + ':' + productId + ')',
         refresh: true
         });
         }
         })
         }
         }
         };
         var backGroudTask = top.Ext.getCmp('backgroundTask');
         backGroudTask.sendRequire = function (requestConfig, Array, index) {
         requestConfig.jsonData = Array[index];
         */
        /*    if (index == 6) {
         requestConfig.method = 'GET';
         }*/
        /*
         setTimeout(function () {
         Ext.Ajax.request(requestConfig);

         }, 100 * (index + 1));

         };
         backGroudTask.doRequestForArray(requestConfig, recordIdArray, i18n.getKey('batch') + i18n.getKey('generate') + i18n.getKey('skuProduct'));*/
    },
    /**
     * 根据原始数据创建form中的item项
     * @param rawData
     * @returns {Array}
     */
    createFormItemConfig: function (rawData) {
        var items = [];
        for (var i = 0; i < rawData.length; i++) {
            var item = rawData[i].attribute;
            var enable = Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], item.inputType);
            var subItems = [];
            for (var j = 0; j < item.options.length; j++) {
                subItems.push({
                    boxLabel: i18n.getKey(item.options[j].name),
                    name: 'item',
                    checked: true,
                    inputValue: item.options[j].name
                })
            }
            if (enable) {
                items.push({
                    xtype: 'checkboxgroup',
                    labelWidth: 150,
                    cls: i % 2 == 0 ? 'x-check-group-alt' : '',
                    labelAlign: 'left',
                    allowBlank: false,
                    fieldLabel: '<font color="green">' + i18n.getKey(item.name) + '</font>',
                    columns: 2,
                    blankText: '该选项值不能为空!',
                    msgTarget: 'side',
                    itemId: item.name,
                    name: item.name,
                    vertical: true,
                    items: subItems
                })
            } else {
                items.push({
                    xtype: 'textfield',
                    labelWidth: 150,
                    msgTarget: 'side',
                    itemId: item.name,
                    name: item.name,
                    allowBlank: false,
                    cls: i % 2 == 0 ? 'x-check-group-alt' : '',
                    emptyText: '该值不允许为空',
                    fieldLabel: '<font color="green">' + i18n.getKey(item.name) + '</font>'
                })
            }
        }
        return items;
    },
    /**
     * 判断批量按钮是否启用
     * @param rawData
     * @returns {boolean}
     */
    buttonIsDisableOrNot: function (rawData) {
        var result = false;
        for (var i = 0; i < rawData.length; i++) {
            var item = rawData[i].attribute;
            var enable = Ext.Array.contains(CGP.product.view.batchgenerateskuproduct.config.Configs.selectableAttribut, item.inputType);
            if (!enable) {
                result = true;
                break;
            }
        }
        return result;
    }
})
