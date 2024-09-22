class GraphDimensions:
    #n_phases: number of phases (currently 2 or 3)
    #n_bulk: Black, White, and Gray vertices
    #n_meta_basic: Basic meta vertics (cathode, anode)
    #n_meta_interfacial: meta vertices between (BLACK/WHITE), (BLACK_GRAY), (WHITE/GRAY)
    def __init__(self, n_phases=2, n_bulk=0, n_meta_basic=2, n_meta_interfacial=1):
        self.n_phases = n_phases
        self.n_bulk = n_bulk
        self.n_meta_basic = n_meta_basic
        if n_phases == 3:
            self.n_meta_interfacial = 3
        else:
            self.n_meta_interfacial = n_meta_interfacial

    def n_total(self):
        return self.n_bulk + self.n_meta_basic + self.n_meta_interfacial


d_g = GraphDimensions()

