Ext.define('CGP.product.view.productattributeconstraint.controller.Controller', {
    /**
     * 编辑multiDiscreteValueConstraintItem
     * @param {Ext.data.Store} skuAttributeStore 产品sku属性集合
     * @param {Array} skuAttributeIds 产品属性约束关联属性Id数组
     * @param {Ext.data.Store} store multiDiscreteValueConstraintItem Store
     * @param {Ext.data.Model} record multiDiscreteValueConstraintItem Model
     * @param {String} editOrNew 编辑状态
     * @param {Array} itemData 该条约束中multiDiscreteValueConstraintItem的所以集合
     * @param {Number} configurableId 可配置产品ID
     */
    editMultiDiscreteValueConstraintItem: function (skuAttributeStore, skuAttributeIds, store, record, editOrNew, itemData,configurableId) {
        Ext.create('CGP.product.view.productattributeconstraint.view.EditMultiDiscreteValueConstraintItem', {
            skuAttributeStore: skuAttributeStore,
            skuAttributeIds: skuAttributeIds,
            configurableId: configurableId,
            itemsStore: store,
            record: record,
            editOrNew: editOrNew,
            itemData: itemData
        });
    },
    /**
     * 更新该约束
     * @param {Object} data 需要更新的最新数据
     * @param {Ext.data.Store} store multiDiscreteValueConstraintItem Store
     * @param {Ext.LoadMask} lm 等待加载提示
     * @param {Ext.data.Model} disEnableRecord 将设为禁用状态的记录
     */
    updateProductAttributeConstraint: function (data, store, lm, disEnableRecord){
        Ext.Ajax.request({
            url: adminPath + 'api/productAttributeConstraints/v2/' + data._id,
            jsonData: data,
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                var disEnableRecordData = disEnableRecord.getData();
                var disEnableRecordId = disEnableRecordData._id;
                if (response.success == true) {
                    if (data.isEnable == false || disEnableRecordId == data._id) {
                        Ext.Msg.alert('提示', '保存成功！');
                        store.load();
                    } else {
                        disEnableRecordData.isEnable = false;
                        Ext.Ajax.request({
                            url: adminPath + 'api/productAttributeConstraints/v2/' + disEnableRecordId,
                            jsonData: disEnableRecordData,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                if (response.success == true) {
                                    Ext.Msg.alert('提示', '保存成功！');
                                    store.load();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    }

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 新建约束
     * @param {Object} data 需要更新的最新数据
     * @param {Ext.data.Store} store multiDiscreteValueConstraintItem Store
     * @param {Ext.LoadMask} lm 等待加载提示
     * @param {Ext.window.Window} win 新建产品属性约束的窗口
     * @param {Ext.data.Model} disEnableRecord 将设为禁用状态的记录
     */
    createProductAttributeConstraint: function (data, store, lm, win, disEnableRecord) {
        Ext.Ajax.request({
            url: adminPath + 'api/productAttributeConstraints/v2',
            jsonData: data,
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                /*var disEnableRecordData = disEnableRecord.getData();
                var disEnableRecordId = disEnableRecordData._id;*/
                if (response.success == true) {
                    if(!Ext.isEmpty(disEnableRecord)){
                        var disEnableRecordData = disEnableRecord.getData();
                        var disEnableRecordId = disEnableRecordData._id;
                        if (data.isEnable == false || disEnableRecordId == data._id) {
                            Ext.Msg.alert('提示', '新建成功！');
                            win.close();
                            store.load();
                        } else {
                            disEnableRecordData.isEnable = false;
                            Ext.Ajax.request({
                                url: adminPath + 'api/productAttributeConstraints/v2/' + disEnableRecordId,
                                jsonData: disEnableRecordData,
                                method: 'PUT',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    if (response.success == true) {
                                        Ext.Msg.alert('提示', '新建成功！');
                                        win.close();
                                        store.load();
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            })
                        }
                    }else{
                        Ext.Msg.alert('提示', '新建成功！');
                        win.close();
                        store.load();
                    }
                    /*if (data.isEnable == false || disEnableRecordId == data._id) {
                        Ext.Msg.alert('提示', '新建成功！');
                        win.close();
                        store.load();
                    } else {
                        disEnableRecordData.isEnable = false;
                        Ext.Ajax.request({
                            url: adminPath + 'api/productAttributeConstraints/v2/' + disEnableRecordId,
                            jsonData: disEnableRecordData,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                if (response.success == true) {
                                    Ext.Msg.alert('提示', '新建成功！');
                                    win.close();
                                    store.load();
                                } else {
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        })
                    }*/
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                lm.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 激活一条产品属性约束为启用状态
     * @param {Ext.data.Store} store 产品属性约束的集合
     * @param {Ext.data.Model} toEnableRecord 将被激活的记录
     * @param {Ext.data.Model} disEnableRecord 将被禁用的记录
     * @param {Ext.form.Panel} formToGrid 约束详细信息的form
     */
    enableProductAttributeConstraint: function (store, toEnableRecord, disEnableRecord, formToGrid) {
        var arr = [toEnableRecord, disEnableRecord];
        var data = {};
        Ext.Array.each(arr, function (item, index) {
            data = item.getData();
            if (item.get('isEnable')) {
                data.isEnable = false;
            } else {
                data.isEnable = true;
            }
            Ext.Ajax.request({
                url: adminPath + 'api/productAttributeConstraints/v2/' + data._id,
                jsonData: data,
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    var data = response.data;
                    if (response.success == true) {
                        if (index == 1) {
                            store.load({callback: function () {
                                var setData = toEnableRecord.getData();
                                setData.isEnable = true;
                                formToGrid.refreshData(setData);
                            }});
                        }
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            })
        })
    },
    /**
     * 删除约束
     * @param {String} id 将要删除的约束Id
     * @param {Ext.data.Store} store 产品属性约束的集合
     * @param {Ext.form.Panel} formToGrid 约束详细信息的form
     */
    deleteProductAttributeConstraint: function (id, store, formToGrid) {
        Ext.Ajax.request({
            url: adminPath + 'api/productAttributeConstraints/v2/' + id,
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    formToGrid.setDisabled(false);
                    Ext.Msg.alert('提示', '删除成功！');
                    store.load();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },
    /**
     * 数组数据源批量创建multiDiscreteValueConstraintItem
     * @param {Ext.data.Store} store multiDiscreteValueConstraintItem store
     * @param {Object} data 批量创建的所有数据
     * @param {array} itemData multiDiscreteValueConstraintItem数组数据
     * @param {Boolean} isCover 是否覆盖multiDiscreteValueConstraintItem数组数据
     * @param {Ext.window.Window} win 批量创建multiDiscreteValueConstraintItem的窗口
     */
    arrayBatchCreate: function (store, data, itemData, isCover, win) {
        var attributeValues = data.attributeGroup;
        var resultArr = [];
        Ext.Array.each(attributeValues, function (item) {
            var attributeArr = [];
            var ConstraintItem = {};
            Ext.Object.each(item, function (key, value) {
                attributeArr.push({
                    attributeId: parseInt(key),
                    clazz: 'com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue',
                    value: {
                        clazz: 'com.qpp.cgp.value.ConstantValue',
                        type: 'Number',
                        value: value
                    }
                })
            });
            ConstraintItem.conditions = data.conditions;
            ConstraintItem.clazz = 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem';
            ConstraintItem.attributeValues = attributeArr;
            resultArr.push(ConstraintItem);
        });
        if (isCover) {
            CGP.product.view.productattributeconstraint.view.FormToGrid.itemData = resultArr;
            store.getProxy().data = resultArr;
        } else {
            CGP.product.view.productattributeconstraint.view.FormToGrid.itemData = Ext.Array.merge(resultArr, itemData);
            store.getProxy().data = Ext.Array.merge(resultArr, itemData);
        }
        store.load();
        win.close();
        //console.log(resultArr);
    },
    /**
     * 决策树数组数据源批量创建multiDiscreteValueConstraintItem
     * @param {Ext.data.Store} store multiDiscreteValueConstraintItem store
     * @param {Object} formData 批量创建的所有数据
     * @param {array} itemData multiDiscreteValueConstraintItem数组数据
     * @param {Boolean} isCover 是否覆盖multiDiscreteValueConstraintItem数组数据
     * @param {Ext.window.Window} win 批量创建multiDiscreteValueConstraintItem的窗口
     */
    dataStructureCreate: function (store, formData, itemData, isCover, win) {
        function DecisionTree(data) {
            this.data = data;
        }

        DecisionTree.prototype.allPaths = function () {
            var self = this;

            function depthFirstPreOrder(node, paths, position) {
                var i, count, path;
                var children = self.children(node);

                if (children.length > 0) {
                    for (i = 0, count = children.length; i < count; i++) {
                        child = children[i];

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
                    path = position.map(function (currentValue) {
                        var node = {
                            attributeId: currentValue.attributeId,
                            //id: currentValue.id,
                            clazz: 'com.qpp.cgp.domain.product.attribute.constraint2.multi.AttributeValue',
                            value: {
                                type: 'Number',
                                clazz: 'com.qpp.cgp.value.ConstantValue',
                                value: (currentValue.id).toString()
                            }
                            /*id:currentValue.id,
                             propertyName:currentValue.propertyName,
                             propertyValue:currentValue.propertyValue*/
                        };
                        return node;
                    });
                    var items = {
                        condition: formData.conditions,
                        clazz: 'com.qpp.cgp.domain.product.attribute.constraint2.multi.MultiDiscreteValueConstraintItem',
                        attributeValues: path
                    }
                    paths.push(items);
                }
            }

            var root = this.root();

            var paths = new Array(), position = new Array();

            depthFirstPreOrder(root, paths, position);

            return paths;
        };

        DecisionTree.prototype.children = function (node) {
            return this.data.filter(function (currentValue) {
                var isOK = (currentValue.pid === node.id);
                return isOK;
            });
        };

        DecisionTree.prototype.root = function () {
            var arrRoot = this.data.filter(function (currentValue) {
                var isOK = (currentValue.id === 0);
                return isOK;
            });
            return arrRoot[0];
        };

        DecisionTree.prototype.depthFirstPreOrderTraversal = function () {

        };
        var attributeValues = Ext.JSON.decode(formData.attributeGroup);
        var tree = new DecisionTree(attributeValues);

        var paths = tree.allPaths();
        if (isCover) {
            CGP.product.view.productattributeconstraint.view.FormToGrid.itemData = paths;
            store.getProxy().data = paths;
        } else {
            CGP.product.view.productattributeconstraint.view.FormToGrid.itemData = Ext.Array.merge(paths, itemData);
            store.getProxy().data = Ext.Array.merge(paths, itemData);
        }
        store.load();
        win.close();
        console.log(paths);
    },
    /**
     * 生成该决策树下属性选项全部可能性组合
     * @param root
     * @param arrayAttribute
     * @param exclude
     * @returns {Array}
     */
    createAttributeValues: function(root,arrayAttribute,exclude){
        var me = this;
        function depthFirstPreOrder(node, paths, position) {
            var i, count, path;
            //var data = {};
            var children = node.childNodes;

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
                var data = {};
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
                 *//*id:currentValue.id,
                 propertyName:currentValue.propertyName,
                 propertyValue:currentValue.propertyValue*//*
                 };
                 return node;
                 });*/
                Ext.Array.each(position,function(item){
                    data[item.data.attributeId] = item.data.optionId
                });
                paths.push(data);
            }
        }


        var paths = new Array(), position = new Array();

        depthFirstPreOrder(root, paths, position);
        if(!exclude){
            return paths
        }else{
            return me.excludeAttributeValues(paths,arrayAttribute);
        }
        //console.log(paths);
    },
    /**
     * 如果exclude为true则所选属性选项组合剔除该决策树下组合
     * @param excludeData
     * @param arrayAttribute
     * @returns {Array}
     */
    excludeAttributeValues: function(excludeData,arrayAttribute){
        function getResultNum(attributeObj) {
            var resultObj = {};
            resultObj.allResultNum = 1;
            resultObj.valueLength = [];
            for (var i = 0; i < attributeObj.length; i++) {
                var tempLength = attributeObj[i].value.length;
                resultObj.valueLength.push(tempLength);
                resultObj.allResultNum = resultObj.allResultNum * tempLength;
            }
            return resultObj;

        }

        /**
         * 在所有组合中存入属性名
         */
        function setAttributName(attributeObj, number) {
            var tempArray = [];
            for (var i = 0; i < number; i++) {
                var tempObj = {};
                tempArray.push(tempObj);
            }
            for (var k = 0; k < attributeObj.length; k++) {
                for (var w = 0; w < tempArray.length; w++) {
                    var tempObj = attributeObj[k].name;
                    tempArray[w][tempObj] = "";
                }
            }
            //console.log(tempArray);
            return tempArray;
        }



        /**
         * 当前元素重复次数
         */
        function getRepeatNum(attributeObj) {
            //循环次数
            var circulateNum = [];
            if (attributeObj.length <= 1) {
                circulateNum = attributeObj.length;
                return circulateNum
            }
            for (var i = 0; i < attributeObj.length; i++) {
                if (i == 0) {
                    circulateNum[i] = 1;
                } else if (i == 1) {
                    circulateNum[i] = attributeObj[i - 1].value.length;
                } else {
                    circulateNum[i] = attributeObj[i - 1].value.length * attributeObj[i - 2].value.length;
                }
            }

            return circulateNum;
        }

        /**
         * 通过循环拼接数组
         * @param {*} repeatNum
         * @param {*} hasAttributeResult
         * @param {*} attributeObj
         */
        function putOptionValue(repeatNum, hasAttributeResult, attributeObj) {
            for (var i = 0; i < attributeObj.length; i++) {
                //当前元素下标
                var currOptionIndex = 0;
                //已重复次数
                var repeatTimes = 0;
                for (var j = 0; j < attributeObj[i].value.length; j++) {
                    for (var k = currOptionIndex; k < hasAttributeResult.length; k++) {
                        var attributeName = attributeObj[i].name;
                        //已重复次数在允许次数之内的时候 才能赋值
                        if (repeatTimes < repeatNum[i]) {
                            hasAttributeResult[k][attributeName] = (attributeObj[i].value[j]).toString();
                            repeatTimes += 1;
                        } else {
                            k = (k - 1) + (repeatNum[i] * (attributeObj[i].value.length - 1));
                            repeatTimes = 0;
                        }
                    }
                    currOptionIndex = currOptionIndex + repeatNum[i];
                }
            }
            return hasAttributeResult;
        }


        /**
         * 使用循环实现
         */
        function byCircle(attributeObj) {
            //计算所有可能性数量
            var resultNum = getResultNum(attributeObj);
            //在所有组合中存入属性名
            var hasAttributeResult = setAttributName(attributeObj, resultNum.allResultNum);
            //测试数据 含有属性名的全部组合
            //saveConsoleData_setAttribute(hasAttributeResult);
            //获取每个元素的重复次数
            var repeatNum = getRepeatNum(attributeObj);
            //通过循环拼接数组
            return putOptionValue(repeatNum, hasAttributeResult, attributeObj);
        }
        var attributeObj = [];
        Ext.Array.each(arrayAttribute,function(item){
            var attribute = {
                name: (item.id).toString(),
                value: []
            };
            Ext.Array.each(item.attribute.options,function(option){
                attribute.value.push(option.id)
            });
            attributeObj.push(attribute);
        });
        var allArray = byCircle(attributeObj);

        function equalAToB( x, y ) {
// If both x and y are null or undefined and exactly the same
            if ( x === y ) {
                return true;
            }

// If they are not strictly equal, they both need to be Objects
            if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
                return false;
            }

//They must have the exact same prototype chain,the closest we can do is
//test the constructor.
            if ( x.constructor !== y.constructor ) {
                return false;
            }

            for ( var p in x ) {
                //Inherited properties were tested using x.constructor === y.constructor
                if ( x.hasOwnProperty( p ) ) {
                    // Allows comparing x[ p ] and y[ p ] when set to undefined
                    if ( ! y.hasOwnProperty( p ) ) {
                        return false;
                    }

                    // If they have the same strict value or identity then they are equal
                    if ( x[ p ] === y[ p ] ) {
                        continue;
                    }

                    // Numbers, Strings, Functions, Booleans must be strictly equal
                    if ( typeof( x[ p ] ) !== "object" ) {
                        return false;
                    }

                    // Objects and Arrays must be tested recursively
                    if ( ! Object.equals( x[ p ], y[ p ] ) ) {
                        return false;
                    }
                }
            }

            for ( p in y ) {
                // allows x[ p ] to be set to undefined
                if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
                    return false;
                }
            }
            return true;
        }
        function remove(a,b){
            Ext.Array.each(a,function(item1,index1){
                Ext.Array.each(b,function(item2,index2){
                    if(equalAToB(item1,item2)){
                        Ext.Array.splice(a,index1,1);
                        Ext.Array.splice(b,index2,1);
                        remove(a,b);
                    }
                })
            });
        }
        remove(allArray,excludeData);
        return allArray;
    }
});
