/*
 Author: Corneliu S. (github.com/upphiminn)
 2013
 */

// obtained from https://github.com/upphiminn/jDBSCAN
// modified to suit earthquake data in GeoJSON format by Florian Fehrenbacher
(function() {
    jDBSCAN = function() {
        //Local instance vars.
        var eps;
        var minPts;
        var data = [];
        var clusters = [];
        var status = [];
        var distance = haversine_distance;


        var dbscan = function() {
            status = [];
            clusters = [];

            for (var i = 0; i < data.length; i++) {
                if (status[i] === undefined) {
                    status[i] = 0; //visited and marked as noise by default
                    var neighbours = get_region_neighbours(i);
                    var num_neighbours = neighbours.length;
                    if (num_neighbours < minPts) {
                        status[i] = 0; //noise
                    } else {
                        clusters.push([]); //empty new cluster
                        var cluster_idx = clusters.length;
                        expand_cluster(i, neighbours, cluster_idx);
                    }
                }
            }

            return status;
        };

        //Core Algorithm Related
        function get_region_neighbours(point_idx) {
            var neighbours = [];
            var d = data[point_idx];

            for (var i = 0; i < data.length; i++) {
                if (point_idx === i) {
                    continue;
                }
                if (distance(data[i], d) <= eps) {
                    neighbours.push(i);
                }
            }

            return neighbours;
        }

        function haversine_distance(point1, point2) {
            // radius of earth
            var R = 6371;
            // lat: geometry[1] and long geometry[0]
            var lat1 = point1.geometry.coordinates[1] * Math.PI / 180,
                lon1 = point1.geometry.coordinates[0] * Math.PI / 180;
            var lat2 = point2.geometry.coordinates[1] * Math.PI / 180,
                lon2 = point2.geometry.coordinates[0] * Math.PI / 180;

            var dLat = lat2 - lat1;
            var dLon = lon2 - lon1;

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;

            return d.toPrecision(4);
        }

        function expand_cluster(point_idx, neighbours, cluster_idx) {
            clusters[cluster_idx - 1].push(point_idx); //add point to cluster
            status[point_idx] = cluster_idx; //assign cluster id

            for (var i = 0; i < neighbours.length; i++) {
                var curr_point_idx = neighbours[i];
                if (status[curr_point_idx] === undefined) {
                    status[curr_point_idx] = 0; //visited and marked as noise by default
                    var curr_neighbours = get_region_neighbours(curr_point_idx);
                    var curr_num_neighbours = curr_neighbours.length;
                    if (curr_num_neighbours >= minPts) {
                        expand_cluster(curr_point_idx, curr_neighbours, cluster_idx);
                    }
                }

                if (status[curr_point_idx] < 1) { // not assigned to a cluster but visited (= 0)
                    status[curr_point_idx] = cluster_idx;
                    clusters[cluster_idx - 1].push(curr_point_idx);
                }
            }
        }

        //Resulting Clusters Center Points
        dbscan.getClusters = function() {
            var num_clusters = clusters.length;
            var clusters_centers = [];

            for (var i = 0; i < num_clusters; i++) {
                if (distance === haversine_distance) {
                    clusters_centers[i] = {
                        location: {
                            latitude: 0,
                            longitude: 0
                        }
                    };
                    clusters_centers[i].maxMagnitude = 0;
                    clusters_centers[i].averageMagnitude = 0;
                    clusters_centers[i].parts = [];
                    for (var j = 0; j < clusters[i].length; j++) {
                        clusters_centers[i].location.latitude += data[clusters[i][j]].geometry.coordinates[1];
                        // longitude with minus value falsifies center point
                        // converting it to positive value solves this problem
                        if(data[clusters[i][j]].geometry.coordinates[0]<0)
                            clusters_centers[i].location.longitude += data[clusters[i][j]].geometry.coordinates[0] + 360;
                        else
                            clusters_centers[i].location.longitude += data[clusters[i][j]].geometry.coordinates[0];
                        // clusters_centers[i].parts.push(data[clusters[i][j]]);
                        clusters_centers[i].averageMagnitude += data[clusters[i][j]].properties.mag;
                        if (clusters_centers[i].maxMagnitude < data[clusters[i][j]].properties.mag)
                            clusters_centers[i].maxMagnitude = data[clusters[i][j]].properties.mag;
                    }

                    clusters_centers[i].averageMagnitude /= clusters[i].length;
                    clusters_centers[i].dimension = clusters[i].length;
                    clusters_centers[i].parts = clusters[i];
                    clusters_centers[i].location.latitude /= clusters[i].length;
                    clusters_centers[i].location.longitude /= clusters[i].length;
                }
            }

            return clusters_centers;
        };

        //Getters and setters
        dbscan.data = function(d) {
            if (arguments.length === 0) {
                return data;
            }
            if (Array.isArray(d)) {
                data = d;
            }

            return dbscan;
        };

        dbscan.eps = function(e) {
            if (arguments.length === 0) {
                return eps;
            }
            if (typeof e === "number") {
                eps = e;
            }

            return dbscan;
        };

        dbscan.minPts = function(p) {
            if (arguments.length === 0) {
                return minPts;
            }
            if (typeof p === "number") {
                minPts = p;
            }

            return dbscan;
        };

        return dbscan;
    }
})();
