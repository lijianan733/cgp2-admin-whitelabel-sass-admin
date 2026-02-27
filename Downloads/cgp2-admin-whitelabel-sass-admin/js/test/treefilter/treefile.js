Ext.application({
    name: 'Fiddle',

    launch: function() {
        Ext.override(Ext.data.Model, {
            // fixes the issue where null newId doesn't use me.internalId to copy the record using its existing ID
            copy: function(newId) {
                var me = this;
                return new me.self(me.raw, newId || me.internalId, null, Ext.apply({}, me[me.persistenceProperty]));
            }
        });

        Ext.override(Ext.data.NodeInterface, {
            statics: {
                getPrototypeBody: function() {
                    var result = this.callParent();

                    result.filter = function(property, value, anyMatch, caseSensitive, matchParentNodes) {
                        var filters = [];

                        //support for the simple case of filtering by property/value
                        if (Ext.isString(property)) {
                            filters.push(new Ext.util.Filter({
                                property: property,
                                value: value,
                                anyMatch: anyMatch,
                                caseSensitive: caseSensitive
                            }));
                        } else if (Ext.isArray(property) || property instanceof Ext.util.Filter) {
                            filters = filters.concat(property);
                        }

                        // At this point we have an array of zero or more Ext.util.Filter objects to filter with,
                        // so here we construct a function that combines these filters by ANDing them together
                        // and filter by that.
                        return this.filterBy(Ext.util.Filter.createFilterFn(filters), null, matchParentNodes);
                    };

                    result.filterBy = function(fn, scope, matchParentNodes) {
                        var me = this,
                            newNode = me.copy(null, true),
                            matchedNodes = [],
                            allNodes = [],
                            markMatch, i;

                        markMatch = function(node) {
                            node.filterMatch = true;
                            if (node.parentNode) {
                                markMatch(node.parentNode);
                            }
                        };

                        newNode.cascadeBy(function(node) {
                            allNodes.push(node);
                            if (fn.call(scope || me, node)) {
                                if (node.isLeaf() || matchParentNodes === true) {
                                    matchedNodes.push(node);
                                }
                            }
                        });

                        for (i = 0; i < matchedNodes.length; i++) {
                            markMatch(matchedNodes[i])
                        }

                        for (i = 0; i < allNodes.length; i++) {
                            if (allNodes[i].filterMatch !== true) {
                                allNodes[i].remove();
                            }
                        }

                        return newNode;
                    };

                    return result;
                }
            }
        });

        Ext.define('Ext.override.data.TreeStore', {
            override: 'Ext.data.TreeStore'

            ,
            hasFilterListeners: false,
            filterListeners: {
                move: function(node, oldParent, newParent, index) {
                    var me = this,
                        snapshotNode = me.snapshot.findChild('id', node.get('id'), true),
                        snapshotNewParent = me.snapshot.findChild('id', newParent.get('id'), true) || me.snapshot;
                    console.log('move listener here');
                    snapshotNewParent.insertChild(index, snapshotNode);
                },
                append: function(parentNode, appendedNode, index) {
                    var me = this,
                        snapshotParentNode = me.snapshot.findChild('id', parentNode.get('id'), true) || me.shapshot,
                        foundNode = me.snapshot.findChild('id', appendedNode.get('id'), true);
                    console.log('append listener here');
                    snapshotParentNode.insertChild(index, foundNode || appendedNode.copy(null, true));
                },
                insert: function(parentNode, insertedNode, refNode) {
                    var me = this,
                        snapshotParentNode = me.snapshot.findChild('id', parentNode.get('id'), true) || me.snapshot,
                        foundNode = me.snapshot.findChild('id', insertedNode.get('id'), true);

                    console.log('insert listener here');
                    snapshotParentNode.insertBefore(foundNode || insertedNode.copy(null, true), refNode);
                },
                remove: function(parentNode, removedNode, isMove) {
                    var me = this;
                    console.log('remove');
                    if (!isMove) {
                        console.log('actually responding to remove');
                        me.snapshot.findChild('id', removedNode.get('id'), true).remove(true);
                    }
                }
            }

            ,
            filter: function(filters, value, anyMatch, caseSensitive, matchParentNodes) {
                if (Ext.isString(filters)) {
                    filters = {
                        property: filters,
                        value: value,
                        root: 'data',
                        anyMatch: anyMatch,
                        caseSensitive: caseSensitive
                    };
                }

                var me = this,
                    decoded = me.decodeFilters(filters),
                    i,
                    doLocalSort = me.sorters.length && me.sortOnFilter && !me.remoteSort,
                    length = decoded.length,
                    filtered;

                for (i = 0; i < length; i++) {
                    me.filters.replace(decoded[i]);
                }

                if (me.remoteFilter) {
                    // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
                    delete me.totalCount;

                    // Reset to the first page, the filter is likely to produce a smaller data set
                    me.currentPage = 1;
                    //the load function will pick up the new filters and request the filtered data from the proxy
                    me.load();
                } else {
                    if (me.filters.getCount()) {
                        me.snapshot = me.snapshot || me.getRootNode().copy(null, true);

                        // Filter the unfiltered dataset using the filter set
                        filtered = me.setRootNode(me.snapshot.filter(me.filters.items, null, null, null, matchParentNodes));
                        filtered.getOwnerTree().expandAll();

                        me.addFilterListeners();

                        if (doLocalSort) {
                            me.sort();
                        } else {
                            // fire datachanged event if it hasn't already been fired by doSort
                            me.fireEvent('datachanged', me);
                            me.fireEvent('refresh', me);
                        }
                    }
                }
                me.fireEvent('filterchange', me, me.filters.items);
            }

            ,
            addFilterListeners: function() {
                var me = this;

                if (!me.hasFilterListeners) {
                    me.on(me.filterListeners);
                    me.hasFilterListeners = true;
                }
            }

            ,
            filterBy: function(fn, scope, matchParentNodes) {
                var me = this;

                me.snapshot = me.snapshot || me.getRootNode().copy(null, true);
                me.setRootNode(me.queryBy(fn, scope || me, matchParentNodes));

                me.addFilterListeners();

                me.fireEvent('datachanged', me);
                me.fireEvent('refresh', me);
            }

            ,
            queryBy: function(fn, scope, matchParentNodes) {
                var me = this;
                return (me.snapshot || me.getRootNode()).filterBy(fn, scope || me, matchParentNodes);
            }

            ,
            clearFilter: function(suppressEvent) {
                var me = this;

                me.filters.clear();

                if (me.hasFilterListeners) {
                    me.un(me.filterListeners);
                    me.hasFilterListeners = false;
                }

                if (me.remoteFilter) {

                    // In a buffered Store, the meaning of suppressEvent is to simply clear the filters collection
                    if (suppressEvent) {
                        return;
                    }

                    // So that prefetchPage does not consider the store to be fully loaded if the local count is equal to the total count
                    delete me.totalCount;

                    // For a buffered Store, we have to clear the prefetch cache because the dataset will change upon filtering.
                    // Then we must prefetch the new page 1, and when that arrives, reload the visible part of the Store
                    // via the guaranteedrange event
                    if (me.buffered) {
                        me.data.clear();
                        me.loadPage(1);
                    } else {
                        // Reset to the first page, clearing a filter will destroy the context of the current dataset
                        me.currentPage = 1;
                        me.load();
                    }
                } else if (me.isFiltered()) {
                    me.setRootNode(me.snapshot);
                    delete me.snapshot;

                    if (suppressEvent !== true) {
                        me.fireEvent('datachanged', me);
                        me.fireEvent('refresh', me);
                    }
                }

                if (me.sorters && me.sorters.items.length > 0) {
                    me.sort();
                }

                me.fireEvent('filterchange', me, me.filters.items);
            }

            ,
            isFiltered: function() {
                var snapshot = this.snapshot;
                return !!(snapshot && snapshot !== this.getRootNode());
            }

            ,
            addFilter: function(filters, applyFilters) {
                var me = this,
                    decoded,
                    i,
                    length;

                // Decode passed filters and replace/add into the filter set
                decoded = me.decodeFilters(filters);
                length = decoded.length;
                for (i = 0; i < length; i++) {
                    me.filters.replace(decoded[i]);
                }

                if (applyFilters !== false) {
                    me.filter();
                }
                me.fireEvent('filterchange', me, me.filters.items);
            }

            ,
            removeFilter: function(toRemove, applyFilters) {
                var me = this;

                if (!me.remoteFilter && me.isFiltered()) {
                    if (toRemove instanceof Ext.util.Filter) {
                        me.filters.remove(toRemove);
                    } else {
                        me.filters.removeAtKey(toRemove);
                    }

                    if (applyFilters !== false) {

                        // Not gone down to zero filters - re-filter Store
                        if (me.filters.getCount()) {
                            me.filter();
                        }

                        // No filters left - let clearFilter do its thing.
                        else {
                            me.clearFilter();
                        }
                    }
                    me.fireEvent('filterchange', me, me.filters.items);
                }
            }

            ,
            sortOnFilter: true,
            remoteFilter: false
        });






        var store = Ext.create('CGP.material.store.Material');
        store.on('load',function(){
            store.clearFilter();
         store.filter('id', '200004', true, false, true);
        });
        Ext.define('TestTree', {
            extend: 'Ext.tree.Panel',
            title: 'Simple Tree',
            width: 600,
            height: 600,
            store: store,
            rootVisible: false
            //, renderTo: Ext.getBody()
            ,
            listeners: {
              afterrender:function(tree){
                  //tree.expandAll();
              },
                itemexpand: function(){
                    /*store.clearFilter();
                    store.filter('id', '200004', true, false, true);*/
                    /*store.filter(Ext.create('Ext.util.Filter', {
                        filterFn: function(item) {
                            return item.get("id") !=  '200004';
                        }*//*,
                        root: 'data'*//*
                    }));*/
                  /*store.clearFilter();
                  store.filter('type', 'MaterialSpu', true, false, true);*/
              }
            },
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('name'),
                    flex: 3,
                    dataIndex: 'name',
                    //locked: true,
                    renderer: function(value, metadata, record){
                        return record.get("name");
                    }
                },{
                    text: i18n.getKey('type'),
                    flex: 1,
                    dataIndex: 'type',
                    renderer: function(value){
                        var type;
                        if(value == 'MaterialSpu'){
                            type = '<div style="color: green">' + 'MaterialSpu' + '</div>'
                        }else if(value == 'MaterialType'){
                            type = '<div style="color: blue">' + 'MaterialType' + '</div>'
                        }
                        return type;
                    }

                }
            ],
            collapsible: true,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'trigger',
                    triggerCls: 'x-form-clear-trigger',
                    onTriggerClick: function() {
                        this.reset();
                        this.focus();
                    },
                    listeners: {
                        change: function(field, newVal) {
                            /*var tree = field.up('treepanel'),
                                store = tree.getStore();

                            if (Ext.isEmpty(newVal)) {
                                store.clearFilter();
                                return;
                            }

                            store.clearFilter();
                            store.filter('type', 'MaterialSpu', true, false, true);*/
                        },
                        buffer: 250
                    }
                }]
            }]
        });

        Ext.widget('container', {
            renderTo: Ext.getBody(),
            layout: 'hbox',
            items: [
                /*Ext.create('TestTree', {
                    title: '... with drag and drop',
                    viewConfig: {
                        plugins: {
                            ptype: 'treeviewdragdrop'
                        }
                    },
                    selModel: {
                        selType: 'treemodel',
                        mode: 'MULTI'
                    },
                    bbar: [{
                        text: 'Add to Selected',
                        handler: function(btn) {
                            var selected = btn.up('treepanel').getSelectionModel().getSelection()[0];
                            if (selected) {
                                //selected.appendChild({text: 'New one', leaf: true});
                                selected.insertChild(0, {
                                    text: 'New one',
                                    leaf: true
                                });
                            }
                            //btn.up('treepanel').getStore().snapshot.appendChild({text: 'New one', leaf: true});
                        }
                    }, {
                        text: 'Remove Selected',
                        handler: function(btn) {
                            var selected = btn.up('treepanel').getSelectionModel().getSelection()[0];
                            if (selected) {
                                selected.remove(true);
                            }
                        }
                    }]
                })*/, Ext.create('TestTree', {
                    title: '<-- I share his store'
                })]
        });



        Ext.define("KitchenSink.model.tree.Task", {
            extend: Ext.data.Model,
            fields: [{
                name: "task",
                type: "string"
            }, {
                name: "user",
                type: "string"
            }, {
                name: "duration",
                type: "float"
            }, {
                name: "done",
                type: "boolean"
            }]
        });

        /*Ext.define('KitchenSink.view.tree.TreeGrid', {
            extend: 'Ext.tree.Panel',

            requires: ['Ext.data.*', 'Ext.grid.*', 'Ext.tree.*', 'Ext.ux.CheckColumn', 'KitchenSink.model.tree.Task'],
            xtype: 'tree-grid',


            title: 'Core Team Projects',
            height: 300,
            useArrows: true,
            rootVisible: false,
            multiSelect: true,
            singleExpand: true,

            initComponent: function() {
                this.width = 600;

                Ext.apply(this, {
                    store: new Ext.data.TreeStore({
                        model: KitchenSink.model.tree.Task,
                        root: {
                            "text": ".",
                            "children": [{
                                "task": "Project: Shopping",
                                "duration": 13.25,
                                "user": "Tommy Maintz",
                                "iconCls": "task-folder",
                                "expanded": true,
                                "children": [{
                                    "task": "Housewares",
                                    "duration": 1.25,
                                    "user": "Tommy Maintz",
                                    "iconCls": "task-folder",
                                    "children": [{
                                        "task": "Kitchen supplies",
                                        "duration": 0.25,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task"
                                    }, {
                                        "task": "Groceries",
                                        "duration": .4,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task",
                                        "done": true
                                    }, {
                                        "task": "Cleaning supplies",
                                        "duration": .4,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task"
                                    }, {
                                        "task": "Office supplies",
                                        "duration": .2,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task"
                                    }]
                                }, {
                                    "task": "Remodeling",
                                    "duration": 12,
                                    "user": "Tommy Maintz",
                                    "iconCls": "task-folder",
                                    "expanded": true,
                                    "children": [{
                                        "task": "Retile kitchen",
                                        "duration": 6.5,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task"
                                    }, {
                                        "task": "Paint bedroom",
                                        "duration": 2.75,
                                        "user": "Tommy Maintz",
                                        "iconCls": "task-folder",
                                        "children": [{
                                            "task": "Ceiling",
                                            "duration": 1.25,
                                            "user": "Tommy Maintz",
                                            "iconCls": "task",
                                            "leaf": true
                                        }, {
                                            "task": "Walls",
                                            "duration": 1.5,
                                            "user": "Tommy Maintz",
                                            "iconCls": "task",
                                            "leaf": true
                                        }]
                                    }, {
                                        "task": "Decorate living room",
                                        "duration": 2.75,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task",
                                        "done": true
                                    }, {
                                        "task": "Fix lights",
                                        "duration": .75,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task",
                                        "done": true
                                    }, {
                                        "task": "Reattach screen door",
                                        "duration": 2,
                                        "user": "Tommy Maintz",
                                        "leaf": true,
                                        "iconCls": "task"
                                    }]
                                }]
                            }, {
                                "task": "Project: Testing",
                                "duration": 2,
                                "user": "Core Team",
                                "iconCls": "task-folder",
                                "children": [{
                                    "task": "Mac OSX",
                                    "duration": 0.75,
                                    "user": "Tommy Maintz",
                                    "iconCls": "task-folder",
                                    "children": [{
                                        "task": "FireFox",
                                        "duration": 0.25,
                                        "user": "Tommy Maintz",
                                        "iconCls": "task",
                                        "leaf": true
                                    }, {
                                        "task": "Safari",
                                        "duration": 0.25,
                                        "user": "Tommy Maintz",
                                        "iconCls": "task",
                                        "leaf": true
                                    }, {
                                        "task": "Chrome",
                                        "duration": 0.25,
                                        "user": "Tommy Maintz",
                                        "iconCls": "task",
                                        "leaf": true
                                    }]
                                }, {
                                    "task": "Windows",
                                    "duration": 3.75,
                                    "user": "Darrell Meyer",
                                    "iconCls": "task-folder",
                                    "children": [{
                                        "task": "FireFox",
                                        "duration": 0.25,
                                        "user": "Darrell Meyer",
                                        "iconCls": "task",
                                        "leaf": true
                                    }, {
                                        "task": "Safari",
                                        "duration": 0.25,
                                        "user": "Darrell Meyer",
                                        "iconCls": "task",
                                        "leaf": true
                                    }, {
                                        "task": "Chrome",
                                        "duration": 0.25,
                                        "user": "Darrell Meyer",
                                        "iconCls": "task",
                                        "leaf": true
                                    }, {
                                        "task": "Internet Exploder",
                                        "duration": 3,
                                        "user": "Darrell Meyer",
                                        "iconCls": "task",
                                        "leaf": true
                                    }]
                                }, {
                                    "task": "Linux",
                                    "duration": 0.5,
                                    "user": "Aaron Conran",
                                    "iconCls": "task-folder",
                                    "children": [{
                                        "task": "FireFox",
                                        "duration": 0.25,
                                        "user": "Aaron Conran",
                                        "iconCls": "task",
                                        "leaf": true
                                    }, {
                                        "task": "Chrome",
                                        "duration": 0.25,
                                        "user": "Aaron Conran",
                                        "iconCls": "task",
                                        "leaf": true
                                    }]
                                }]
                            }]
                        },
                        folderSort: true
                    }),
                    columns: [{
                        xtype: 'treecolumn', //this is so we know which column will show the tree
                        text: 'Task',
                        flex: 2,
                        sortable: true,
                        dataIndex: 'task'
                    }, {
                        //we must use the templateheader component so we can use a custom tpl
                        xtype: 'templatecolumn',
                        text: 'Duration',
                        flex: 1,
                        sortable: true,
                        dataIndex: 'duration',
                        align: 'center',
                        //add in the custom tpl for the rows
                        tpl: Ext.create('Ext.XTemplate', '{duration:this.formatHours}', {
                            formatHours: function(v) {
                                if (v < 1) {
                                    return Math.round(v * 60) + ' mins';
                                } else if (Math.floor(v) !== v) {
                                    var min = v - Math.floor(v);
                                    return Math.floor(v) + 'h ' + Math.round(min * 60) + 'm';
                                } else {
                                    return v + ' hour' + (v === 1 ? '' : 's');
                                }
                            }
                        })
                    }, {
                        text: 'Assigned To',
                        flex: 1,
                        dataIndex: 'user',
                        sortable: true
                    }, {
                        xtype: 'checkcolumn',
                        header: 'Done',
                        dataIndex: 'done',
                        width: 55,
                        stopSelection: false,
                        menuDisabled: true
                    }, {
                        text: 'Edit',
                        width: 55,
                        menuDisabled: true,
                        xtype: 'actioncolumn',
                        tooltip: 'Edit task',
                        align: 'center',
                        icon: 'resources/images/edit_task.png',
                        handler: function(grid, rowIndex, colIndex, actionItem, event, record, row) {
                            Ext.Msg.alert('Editing' + (record.get('done') ? ' completed task' : ''), record.get('task'));
                        },
                        // Only leaf level tasks may be edited
                        isDisabled: function(view, rowIdx, colIdx, item, record) {
                            return !record.data.leaf;
                        }
                    }]
                });
                this.callParent();
            }
        });*/

        /*Ext.widget('tree-grid', {
            renderTo: Ext.getBody(),
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    xtype: 'trigger',
                    triggerCls: 'x-form-clear-trigger',
                    onTriggerClick: function() {
                        this.reset();
                        this.focus();
                    },
                    listeners: {
                        change: function(field, newVal) {
                            var tree = field.up('tree-grid'),
                                store = tree.getStore();

                            if (Ext.isEmpty(newVal)) {
                                store.clearFilter();
                                return;
                            }

                            //store.clearFilter();  // commenting to show how filters can combine
                            store.filter('task', newVal, true, false);
                        },
                        buffer: 250
                    }
                }, {
                    text: '> than 1.5 hours',
                    enableToggle: true,
                    toggleHandler: function(btn, pressed) {
                        var tree = btn.up('tree-grid'),
                            store = tree.getStore();

                        if (pressed) {
                            store.filter(Ext.create('Ext.util.Filter', {
                                filterFn: function(item) {
                                    return item.get("duration") > 1.5;
                                },
                                root: 'data'
                            }));
                        } else {
                            store.clearFilter();
                        }
                    }
                }]
            }]
        });*/
    }
});