Ext.define('CGP.material.override.Filter', {
    filterByText: function(text) {
        this.filterBy1(text, 'type');
    },


    /**
     * Filter the tree on a string, hiding all nodes expect those which match and their parents.
     * @param The term to filter on.
     * @param The field to filter on (i.e. 'text').
     */
    filterBy1: function(text, by) {

        this.clearFilter();

        var view = this.getView(),
            me = this,
            nodesAndParents = [];

        // Find the nodes which match the search term, expand them.
        // Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;

            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1 && !currNode.data['isLeaf']) {
                me.expandPath(currNode.getPath());
                while(currNode.parentNode) {
                    nodesAndParents.push(currNode.id);
                    /*currNode.on('expand',function(){
                        Ext.Array.each(currNode.childNodes,function(item){
                            nodesAndParents.push(item.id);
                        })
                        me.getRootNode().cascadeBy(function(tree, view){
                            var uiNode = view.getNodeByRecord(this);

                            if(uiNode && Ext.Array.contains(nodesAndParents, this.id)) {
                                Ext.get(uiNode).setDisplayed('none');
                            }
                        }, null, [me, view]);
                    });*/
                    currNode = currNode.parentNode;
                }
            }
        }, null, [me, view]);

        // Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode && Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
        //this.expandAll();
    },
    filterByArray: function(text, by) {

        this.clearFilter();

        var view = this.getView(),
            me = this,
            nodesAndParents = [];

        // Find the nodes which match the search term, expand them.
        // Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;
            Ext.Array.each(text,function(item){
                if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase() == item.id.toLowerCase()) {
                    //me.expandPath(currNode.getPath());
                    while(currNode.parentNode) {
                        nodesAndParents.push(currNode.id);
                        currNode = currNode.parentNode;
                    }
                }
            });

        }, null, [me, view]);

        // Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
        //this.expandAll();
    },

    clearFilter: function() {
        var view = this.getView();

        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    }
});