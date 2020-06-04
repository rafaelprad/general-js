let verticeBusca = 'A';
// Composing the vertices
let verticesDistances = [
  { v1: 'A', v2: 'B', dist: 6, visit: false },
  { v1: 'A', v2: 'D', dist: 1, visit: false },
  { v1: 'B', v2: 'C', dist: 5, visit: false },
  { v1: 'B', v2: 'D', dist: 2, visit: false },
  { v1: 'B', v2: 'E', dist: 5, visit: false },
  { v1: 'C', v2: 'E', dist: 5, visit: false },
  { v1: 'D', v2: 'E', dist: 1, visit: false }];
console.log(verticesDistances);

// Filtering the vertices names on v1
const listVerticesNamesV_1 = verticesDistances.map((v) => { return v.v1; });
// Filtering the vertices names on v2
const listVerticesNamesV_2 = verticesDistances.map((v) => { return v.v2; });

// Concatenating vertices names on v1 and v2
let listVerticesNamesV_General = [...listVerticesNamesV_1, ...listVerticesNamesV_2];

// Filtering duplicates vertices names and create a structure to define a distance
let listVertices = [];
listVerticesNamesV_General.map((v) => { if (!listVertices.find(v_ => { return v_.vert == v; })) { listVertices.push({ vert: v, visit: false, childVert: [], dist: -1 }) }; return v; });
console.log(listVertices);


function resetVisitedVerticesDistances(vertSearch) {
  for (let idxVert = 0; idxVert < listVertices.length; idxVert++) {

    listVertices[idxVert].visit = false;
    if (listVertices[idxVert].vert != vertSearch) {
      for (let idxChildVert = 0; idxChildVert < listVertices[idxVert].childVert.length; idxChildVert++) {
        listVertices[idxVert].childVert[idxChildVert].checked = false;
      }
    }
  }
}

function loadChildVertices() {
  for (let idxVert = 0; idxVert < listVertices.length; idxVert++) {

    for (let idxVertDistances = 0; idxVertDistances < verticesDistances.length; idxVertDistances++) {

      if (verticesDistances[idxVertDistances].v1 == listVertices[idxVert].vert &&
        verticesDistances[idxVertDistances].v2 != listVertices[idxVert].vert) {
        listVertices[idxVert].childVert.push({ vert: verticesDistances[idxVertDistances].v2, checked: false });
      } else if (verticesDistances[idxVertDistances].v2 == listVertices[idxVert].vert &&
        verticesDistances[idxVertDistances].v1 != listVertices[idxVert].vert) {
        listVertices[idxVert].childVert.push({ vert: verticesDistances[idxVertDistances].v1, checked: false });
      }
    }
  }
}

loadChildVertices();

function printPathDistance(listCaseDist) {

  let idxMinPathVert_ = -1;
  let numMinPathDist_ = -1;
  for (let idxPathVert_ = 0; idxPathVert_ < listCaseDist.length; idxPathVert_++) {
    console.log('Path: %s - Dist: %d', listCaseDist[idxPathVert_].seq, listCaseDist[idxPathVert_].dist)
    if (numMinPathDist_ <= 0 || (numMinPathDist_ > listCaseDist[idxPathVert_].dist && listCaseDist[idxPathVert_].dist != 0)) {
      numMinPathDist_ = listCaseDist[idxPathVert_].dist;
      idxMinPathVert_ = idxPathVert_;
    }
  }

  console.log('Shortest Path: %s - Dist: %d', listCaseDist[idxMinPathVert_].seq, listCaseDist[idxMinPathVert_].dist)
}

function calculateVerticesDistances() {
  let listCaseDist = [];
  for (let idxVert = 0; idxVert < listVertices.length; idxVert++) {

    let valCase = { seq: '', dist: 0 };
    // Calculate vertice 
    for (let idxChildVert = 0;
      ((idxChildVert < listVertices[idxVert].childVert.length && listVertices[idxVert].vert != verticeBusca) ||
        (listVertices[idxVert].vert == verticeBusca && listVertices[idxVert].visit == false));
      idxChildVert++) {
      valCase.seq = '';
      if (listVertices[idxVert].vert == verticeBusca) {
        listVertices[idxVert].visit = true;
        listCaseDist.push({ seq: listVertices[idxVert].vert, dist: 0 });
      } else {

        while (listVertices[idxVert].childVert.find((v) => { return v.checked == false; })) {

          resetVisitedVerticesDistances(listVertices[idxVert].vert);

          listVertices[idxVert].visit = true;

          let valCase = calculateVerticeDistanceNode(listVertices[idxVert], verticeBusca, true);

          if (valCase != undefined) {
            if (valCase.seq.indexOf(listVertices[idxVert].vert) == -1) {
              valCase.seq = listVertices[idxVert].vert + valCase.seq;
            }
            listCaseDist.push(valCase);
          }
        }
      }
    }
  }
  printPathDistance(listCaseDist);
}

function calculateVerticeDistanceNode(listChildVertice, vertBusca, staMainLevel) {
  let valCase = undefined;

  if (listChildVertice.vert !== vertBusca) {

    listChildVertice.visit = true;

    for (let idxChildVert_ = 0; idxChildVert_ < listChildVertice.childVert.length; idxChildVert_++) {

      if ((listChildVertice.childVert[idxChildVert_].checked === false && staMainLevel == true) ||
        (staMainLevel == false)) {

        if (staMainLevel == true) {
          listChildVertice.childVert[idxChildVert_].checked = true;
        }

        if (listChildVertice.childVert[idxChildVert_].vert !== vertBusca) {

          for (let idxVert_ = 0; idxVert_ < listVertices.length; idxVert_++) {

            if (listChildVertice.childVert[idxChildVert_].vert == listVertices[idxVert_].vert) {
              if (listVertices[idxVert_].visit == false) {

                valCase = calculateVerticeDistanceNode(listVertices[idxVert_], vertBusca, false);

                if (valCase !== undefined) {

                  let idxVertDistance = -1;

                  for (let idxFindVertDistance = 0; idxFindVertDistance < verticesDistances.length; idxFindVertDistance++) {
                    if ((verticesDistances[idxFindVertDistance].v1 == listChildVertice.vert &&
                      verticesDistances[idxFindVertDistance].v2 == '' + valCase.seq.charAt(0)) ||
                      (verticesDistances[idxFindVertDistance].v1 == '' + valCase.seq.charAt(0) &&
                        verticesDistances[idxFindVertDistance].v2 == listChildVertice.vert
                      )) {
                      idxVertDistance = idxFindVertDistance;
                      break;
                    }
                  }

                  valCase.seq = listChildVertice.vert + valCase.seq;
                  if (idxVertDistance != -1) {
                    valCase.dist += verticesDistances[idxVertDistance].dist;
                  }
                  return valCase;
                }
              } else {
                break;
              }
            }
          }

        } else if (listChildVertice.childVert[idxChildVert_].vert === vertBusca) {

          if (staMainLevel) {
            listChildVertice.childVert[idxChildVert_].checked = true;
          }

          let idxVertDistance = -1;

          for (let idxFindVertDistance = 0; idxFindVertDistance < verticesDistances.length; idxFindVertDistance++) {
            if ((verticesDistances[idxFindVertDistance].v1 == listChildVertice.vert &&
              verticesDistances[idxFindVertDistance].v2 == '' + listChildVertice.childVert[idxChildVert_].vert) ||
              (verticesDistances[idxFindVertDistance].v1 == '' + listChildVertice.childVert[idxChildVert_].vert &&
                verticesDistances[idxFindVertDistance].v2 == listChildVertice.vert
              )) {
              idxVertDistance = idxFindVertDistance;
              break;
            }
          }
          valCase = { seq: listChildVertice.vert + listChildVertice.childVert[idxChildVert_].vert, dist: -1 };

          if (idxVertDistance != -1) {
            valCase.dist = verticesDistances[idxVertDistance].dist;
          }

          return valCase;
        }
      }
    }

  } else {
    return valCase;
  }
}

calculateVerticesDistances();

