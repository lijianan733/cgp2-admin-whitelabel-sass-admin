/**
 * Created by bourne on 2017/11/22.
 */
Ext.onReady(function () {
    Ext.create('Ext.form.Panel', {
        renderTo: Ext.getBody(),
        width: 500,
        frame: true,
        bodyPadding: '10 10 0',

        /*defaults: {
         anchor: '100%',
         allowBlank: false,
         msgTarget: 'side',
         labelWidth: 50
         },*/
        items: [
            {
                name: 'productId',
                id: 'productId',
                width: 450,
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'productId',
                allowBlank: false
            }
        ],


        buttons: [
            {
                text: 'create',
                handler: function () {
                    var form = this.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var value = Ext.getCmp('productId').getValue();
                        form.value = value;
                        Ext.Ajax.request({
                            url: 'https://dev-sz-qpson-nginx.qppdev.com/cgp-rest/api/products/configurable/' + value + '/skuAttributes',
                            method: 'GET',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            callback: function (options, success, response) {
                                var resp = eval('(' + response.responseText + ')');
                                            var skuAttributeArr = resp.data;
                                 var root = {id: 0,name:'root',optionId: 'root',children: []};
                                 form.createTreeData(0,root,skuAttributeArr);
                                 form.createAttributeValues(root);
                            }
                        });
                    }
                }
            }
        ],
        createTreeData: function (n, parent, attributeObj) {
            var me = this;
            Ext.Array.each(attributeObj[n].attribute.options, function (item, index) {
                var child = {
                    attributeId: attributeObj[n].attribute.id,
                    attributeName: attributeObj[n].displayName,
                    optionId: item.id,
                    children: [],
                    optionName: item.name,
                    leaf: true

                };
                parent.children.push(child);
                if (n < attributeObj.length - 1) {
                    child.children = [];
                    child.leaf = false;
                    me.createTreeData(n + 1, child, attributeObj)
                }
            });

        },
        createAttributeValues: function (root) {
            var me = this;

            function depthFirstPreOrder(node, paths, position) {
                var i, count, path;
                //var data = {};
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
                    /*path = position.map(function (currentValue) {
                     var node = {
                     attributeId: currentValue.data.attributeId,
                     //id: currentValue.id,
                     clazz: '',
                     value: {
                     type: 'Number',
                     clazz: 'constantValue',
                     value: (currentValue.data.optionId).toString()
                     }
                     */
                    /*id:currentValue.id,
                     propertyName:currentValue.propertyName,
                     propertyValue:currentValue.propertyValue*/
                    /*
                     };
                     return node;
                     });*/
                    Ext.Array.each(position, function (item) {
                        var a = {};
                        a.id = item.attributeId;
                        a.value = parseInt(item.optionId);
                        data.push(a);
                        //data[item.data.attributeId] = item.data.optionId
                    });
                    paths.push(data);
                }
            }


            var paths = new Array(), position = new Array();
            //console.log(paths);

            depthFirstPreOrder(root, paths, position);
            /*var requestConfig = {
             url: adminPath + 'api/applicationMode',
             method: 'GET',
             headers: {
             Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
             },
             async: false,
             callback: function (options, success, response) {
             var resp = eval('(' + response.responseText + ')');
             websiteMode = resp.data;
             }
             };
             Ext.Ajax.request(requestConfig);*/
            Ext.Array.each(paths, function (itemo) {
                var requestConfig = {
                    url: adminPath + 'api/products/' + me.value + '/skuProduct',
                    method: 'POST',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    jsonData: itemo,
                    async: false,
                    callback: function (options, success, response) {
                        /*var resp = eval('(' + response.responseText + ')');
                         websiteMode = resp.data;*/
                    }
                };
                Ext.Ajax.request(requestConfig);
            });
            //console.log(paths);
        }
    });

    Ext.Ajax.request({
        url: 'https://dev-sz-qpson-nginx.qppdev.com/cgp-rest/api/products/configurable/' + 610474 + '/skuAttributes',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        async: false,
        callback: function (options, success, response) {
            var resp = eval('(' + response.responseText + ')');
            websiteMode = resp.data;
        }
    });
});

