'use client';
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Bus, Clock, MapPin } from 'lucide-react';

const BusRouteViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRouteIds, setExpandedRouteIds] = useState(new Set());

  // Sample data structure based on the PDF
  const routes = [
    {
      "id": 1,
      "routeNo": "ROUTE NO.1",
      "routeName": "ENNORE",
      "stops": [
        {
          "name": "ENNORE -- ENNORE DEPOT",
          "time": "5.35"
        },
        {
          "name": "KATHIVAKKAM -- BUS STAND",
          "time": "5.35"
        },
        {
          "name": "ERNAVORE -- BUS STAND",
          "time": "5.35"
        },
        {
          "name": "THIRUVETRIUR -- BUS DEPOT",
          "time": "5.40"
        },
        {
          "name": "ELLAIAMMAN -- KOIL BUS STOP",
          "time": "5.43"
        },
        {
          "name": "KALIDIPET -- METRO",
          "time": "5.45"
        },
        {
          "name": "N4 -- POLICE STATION POLICE STATION",
          "time": "5.50"
        },
        {
          "name": "KASI -- MEDU SIGNAL",
          "time": "5.52"
        },
        {
          "name": "KAL -- MANDAPAM POLICE STATION",
          "time": "5.55"
        },
        {
          "name": "RAYAPURAM -- SIGNAL",
          "time": "5.58"
        },
        {
          "name": "MANNADY -- FLY OVER DOWN",
          "time": "6.02"
        },
        {
          "name": "BEACH -- STATION HP PETROL BUNK",
          "time": "6.02"
        },
        {
          "name": "RIBBEN -- BUILDING BUS STOP",
          "time": "6.08"
        },
        {
          "name": "EGMORE -- THANTHI",
          "time": "6.13"
        },
        {
          "name": "CHETPET -- BUS STOP",
          "time": "6.15"
        },
        {
          "name": "KELPAKKAM -- MEDICAL HOSPITAL /BUS STOP",
          "time": "6.20"
        },
        {
          "name": "PACHIYAPPAS -- COLLEGE GATE ENTRANCE METRO",
          "time": "6.25"
        }
      ]
    },
    {
      "id": 2,
      "routeNo": "ROUTE NO.2",
      "routeName": "TANDAIYARPET",
      "stops": [
        {
          "name": "PATINATHAR -- KOIL SUDUKADU",
          "time": "5.45"
        },
        {
          "name": "LAKSHMI -- KOIL",
          "time": "5.50"
        },
        {
          "name": "THANDAIYARPET -- DEPOT",
          "time": "5.55"
        },
        {
          "name": "THANDAIYARPET -- APOLLO",
          "time": "5.55"
        },
        {
          "name": "OLD -- WASHERMAN PET CLOCK TOWER",
          "time": "6.00"
        },
        {
          "name": "MAHARANI -- POST OFFICE",
          "time": "6.05"
        },
        {
          "name": "NEW -- WASHERMANPET PANDIYAN THEATER",
          "time": "6.03"
        },
        {
          "name": "MAHARANI -- CEMENT ROAD",
          "time": "6.03"
        },
        {
          "name": "MINT -- DEPOT",
          "time": "6.08"
        },
        {
          "name": "ARUMPAKKAM -- VAISHNAVA COLLEGE",
          "time": "6.23"
        }
      ]
    },
    {
      "id": 3,
      "routeNo": "ROUTE NO.3",
      "routeName": "MINT",
      "stops": [
        {
          "name": "MINT -- DEPOT",
          "time": "6.10"
        },
        {
          "name": "BASIN -- BRIDGE SIGNAL",
          "time": "6.13"
        },
        {
          "name": "CHOOLAI -- POST OFFICE",
          "time": "6.18"
        },
        {
          "name": "PURASAIVAKKAM -- SARAVANA STORE",
          "time": "6.20"
        },
        {
          "name": "AMJIKARAI -- BUS STOP",
          "time": "6.30"
        },
        {
          "name": "SKY -- WALK MALL",
          "time": "6.30"
        },
        {
          "name": "ARUMPAKKAM -- BUS STOP",
          "time": "6.32"
        },
        {
          "name": "ARUMPAKKAM",
          "time": "6.32"
        }
      ]
    },
    {
      "id": 4,
      "routeNo": "ROUTE NO.4",
      "routeName": "ADAYAR",
      "stops": [
        {
          "name": "RAJA -- ANNAMALAI PURAM SATHYA STUDIO",
          "time": "5.55"
        },
        {
          "name": "PATTINAMPAKKAM -- PATTINAMPAKKAM BUS STOP",
          "time": "6.00"
        },
        {
          "name": "SANTHOME -- SANTHOME CHURCH",
          "time": "6.05"
        },
        {
          "name": "LIGHT -- HOUSE LIGHT HOUSE",
          "time": "6.07"
        },
        {
          "name": "TRIPLICANE -- ICE HOUSE",
          "time": "6.10"
        },
        {
          "name": "TRIPLICANE -- RATHNA CAFE",
          "time": "6.15"
        },
        {
          "name": "ROYAPETTAH -- ROYAPETTAH (GH)",
          "time": "6.25"
        },
        {
          "name": "GOPALAPURAM -- NEW COLLEGE",
          "time": "6.30"
        },
        {
          "name": "GEMINI -- BRIDGE BUS STOP",
          "time": "6.32"
        },
        {
          "name": "TEYNAMPET -- SCIET COLLEGE",
          "time": "6.35"
        }
      ]
    },
    {
      "id": 5,
      "routeNo": "ROUTE NO.5",
      "routeName": ".CHEPAUK",
      "stops": [
        {
          "name": "CHINTADRIPET -- CHINTADRIPET",
          "time": "6.12"
        },
        {
          "name": "MOUNT -- ROAD, MOUNT ROAD,",
          "time": "6.14"
        },
        {
          "name": "PUDHUPET -- PUDHUPET",
          "time": "6.14"
        },
        {
          "name": "CO -- OPTEX CO OPTEX",
          "time": "6.15"
        },
        {
          "name": "LOYOLA -- COLLEGE LOYOLA COLLEGE",
          "time": "6.20"
        },
        {
          "name": "CHOOLAIMEDU -- CHOOLAIMEDU",
          "time": "6.25"
        },
        {
          "name": "METHA -- NAGAR METHA NAGAR",
          "time": "6.26"
        },
        {
          "name": "NSK -- NAGAR BUS STOP NSK NAGAR BUS STOP",
          "time": "6.28"
        }
      ]
    },
    {
      "id": 6,
      "routeNo": "ROUTE NO.6",
      "routeName": "KOTOORBURAM",
      "stops": [
        {
          "name": "KOTOORBURAM -- SIGNAL",
          "time": "5.50"
        },
        {
          "name": "NANTHANAM -- METRO",
          "time": "5.55"
        },
        {
          "name": "MANTHAVELI -- RAILWAY BRIDGE",
          "time": "6.10"
        },
        {
          "name": "MYLOPRE -- POST OFFICE",
          "time": "6.10"
        },
        {
          "name": "PATINAMPAKKAM -- SIGNAL",
          "time": "6.12"
        },
        {
          "name": "SANTHOME -- CHURCH",
          "time": "6.12"
        },
        {
          "name": "LIGHT -- HOUSE BUS STAND",
          "time": "6.15"
        },
        {
          "name": "CITY -- CENTER SIGNAL",
          "time": "6.16"
        },
        {
          "name": "STELLA -- MARIES SIGNAL",
          "time": "6.18"
        },
        {
          "name": "GEMINI -- BRIDGE SUBWAY",
          "time": "6.20"
        },
        {
          "name": "VALLUVARKOTTAM -- SIGNAL",
          "time": "6.25"
        },
        {
          "name": "KODAMPAKKAM -- MEENAKSHI COLLEGE OPOSITE",
          "time": "6.28"
        },
        {
          "name": "POWER -- HOUSE SIGNAL",
          "time": "6.35"
        },
        {
          "name": "PORUR -- SARAVANA STORES",
          "time": "6.50"
        }
      ]
    },
    {
      "id": 7,
      "routeNo": "ROUTE NO.7",
      "routeName": "KKD NAGAR",
      "stops": [
        {
          "name": "KKD -- NAGAR BUS STOP",
          "time": "5.44"
        },
        {
          "name": "KODUNGAYUR -- BUS STOP",
          "time": "5.44"
        },
        {
          "name": "KKD -- NAGAR E.B STOP",
          "time": "5.45"
        },
        {
          "name": "KKD -- NAGAR STOP",
          "time": "5.45"
        },
        {
          "name": "KODUNGAIYUR -- MUTHAMIZH NAGAR",
          "time": "5.45"
        },
        {
          "name": "KODUNGAIYUR -- ST. JOSEPH CHURCH",
          "time": "5.45"
        },
        {
          "name": "KODUNGAIYUR -- KODUNGAIYUR",
          "time": "5.45"
        },
        {
          "name": "KODUNGAIYUR -- VIYASARBADI",
          "time": "5.45"
        },
        {
          "name": "KODUNGAIYUR -- BUS DEPOT",
          "time": "5.45"
        },
        {
          "name": "M -- R NAGAR STOP",
          "time": "5.47"
        },
        {
          "name": "ERUKANCHERI -- STOP",
          "time": "5.50"
        },
        {
          "name": "ERUKANCHERI -- ERUKANCHERI CHURCH",
          "time": "5.50"
        },
        {
          "name": "SHARMA -- NAGAR JOSEPH STORE OPP.",
          "time": "5.52"
        },
        {
          "name": "SHARMA -- NAGAR STOP",
          "time": "5.52"
        },
        {
          "name": "AMBEDHKAR -- COLLEGE STOP",
          "time": "5.55"
        },
        {
          "name": "VIYASARPADI -- JEEVA RAILWAY STATION",
          "time": "5.58"
        },
        {
          "name": "PATTALAM -- STOP",
          "time": "6.05"
        },
        {
          "name": "OTTERI -- STOP",
          "time": "6.05"
        },
        {
          "name": "OTTERI -- PODI KADAI BUS STOP",
          "time": "6.05"
        },
        {
          "name": "VILLIVAKKAM -- BUS STOP",
          "time": "6.15"
        },
        {
          "name": "NADHAMUNI -- THEATRE STOP",
          "time": "6.17"
        }
      ]
    },
    {
      "id": 8,
      "routeNo": "ROUTE NO.8",
      "routeName": "MANALI",
      "stops": [
        {
          "name": "MANALI -- MARKET",
          "time": "5.40"
        },
        {
          "name": "MATHUR -- SECOND STREET",
          "time": "5.45"
        },
        {
          "name": "MATHUR -- PAL PANNAI",
          "time": "5.50"
        },
        {
          "name": "ARUL -- NAGAR BUS STOP",
          "time": "5.55"
        },
        {
          "name": "PERAMBUR -- DON BOSCO",
          "time": "6.00"
        },
        {
          "name": "PERUMBUR -- LAKSHMI KOIL",
          "time": "6.05"
        },
        {
          "name": "PERUMBUR -- BUS STAND",
          "time": "6.10"
        },
        {
          "name": "PERUMBUR -- RAILWAY STATION",
          "time": "6.10"
        },
        {
          "name": "SEMBIUM -- POLICE STATION",
          "time": "6.15"
        },
        {
          "name": "SEMBIUM -- GANDHI STATUE",
          "time": "6.16"
        },
        {
          "name": "VENUS -- BUS STOP",
          "time": "6.20"
        }
      ]
    },
    {
      "id": 9,
      "routeNo": "ROUTE NO.9",
      "routeName": "MOOLAKADAI",
      "stops": [
        {
          "name": "THAPALPETTI -- BUS STOP",
          "time": "6.05"
        },
        {
          "name": "MOOLAKADAI -- BUS STOP JUNCTION",
          "time": "6.08"
        },
        {
          "name": "MOOLAKADAI -- INDIAN OIL PETROL BUNK",
          "time": "6.08"
        },
        {
          "name": "MATHAVARAM -- OUTER KALPANA LAMP",
          "time": "6.08"
        },
        {
          "name": "RETERI -- RTO",
          "time": "6.12"
        },
        {
          "name": "TEMPLE -- SCHOOL SIGNAL",
          "time": "6.15"
        },
        {
          "name": "SENTHIL -- NAGAR BUS STOP",
          "time": "6.20"
        },
        {
          "name": "DATHANAKUPAM -- BUS STOP",
          "time": "6.25"
        }
      ]
    },
    {
      "id": 10,
      "routeNo": "ROUTE NO.10",
      "routeName": "TVK NAGAR",
      "stops": [
        {
          "name": "THRU -- VI KA NAGAR THRU VI KA NAGAR",
          "time": "6.00"
        },
        {
          "name": "AGARAM -- JUNCTION AGARAM JUNCTION",
          "time": "6.02"
        },
        {
          "name": "RETTERI -- JUNCTION",
          "time": "6.12"
        },
        {
          "name": "ANNA -- NAGAR WEST DEPOT",
          "time": "6.30"
        },
        {
          "name": "PERIYAR -- NAGAR PERIYAR NAGAR BUS STOP",
          "time": "6.05"
        },
        {
          "name": "PERIYAR -- NAGAR DONBOSCO SCHOOL",
          "time": "6.08"
        },
        {
          "name": "PERIYAR -- NAGAR SIVNIVASA BAKERY",
          "time": "6.10"
        },
        {
          "name": "PERIYAR -- NAGAR WELDING SHOP",
          "time": "6.12"
        },
        {
          "name": "PERIYAR -- NAGAR MOOGAMBIHAI KOVIL",
          "time": "6.15"
        },
        {
          "name": "PERIYAR -- NAGAR KOLATHUR",
          "time": "6.20"
        },
        {
          "name": "PERIYAR -- NAGAR PADI LUCAS",
          "time": "6.25"
        }
      ]
    },
    {
      "id": 12,
      "routeNo": "ROUTE NO.12",
      "routeName": "AYANAVARAM",
      "stops": [
        {
          "name": "OTTERI -- OTTERI BRIDGE",
          "time": "6.10"
        },
        {
          "name": "AYANAVARAM -- SIGNAL",
          "time": "6.10"
        },
        {
          "name": "AYANAVARAM -- SAYANSI COMPLEX",
          "time": "6.10"
        },
        {
          "name": "AYANAVARAM -- NOOR HOTEL",
          "time": "6.10"
        },
        {
          "name": "AYANAVARAM -- JOINT OFFICE",
          "time": "6.10"
        },
        {
          "name": "AYANAVARAM -- RAILWAY QUARTERS",
          "time": "6.15"
        },
        {
          "name": "ICF -- ICF THIRUVALLUVAR MAHAL",
          "time": "6.15"
        },
        {
          "name": "NEW -- AVADI ROAD K4 POLICE STATION SIGNAL",
          "time": "6.15"
        },
        {
          "name": "CHITHAMANI -- CHITHAMANI PARK",
          "time": "6.20"
        },
        {
          "name": "CHITHAMANI -- CHITHAMANI BUS STOP",
          "time": "6.20"
        },
        {
          "name": "ANNA -- NAGAR ANNA NAGAR ROUNDNA",
          "time": "6.23"
        },
        {
          "name": "SHANTHI -- COLONY SHANTHI COLONY SIGNAL",
          "time": "6.23"
        },
        {
          "name": "SHANTHI -- COLONY BHARATH PETROL BUNK STOP",
          "time": "6.23"
        },
        {
          "name": "VR -- MAHAL VR MAHAL",
          "time": "6.27"
        },
        {
          "name": "KOYAMBEDU -- ROHINI THEATRE",
          "time": "6.30"
        },
        {
          "name": "NERKUNDRAM -- NERKUNDRAM",
          "time": "6.30"
        }
      ]
    },
    {
      "id": 13,
      "routeNo": "ROUTE NO.13",
      "routeName": "TVK NAGAR",
      "stops": [
        {
          "name": "ROHINI -- THEATER OPOSITE",
          "time": "6.40"
        },
        {
          "name": "NERKUNDRAM -- VENGAYA MANDI",
          "time": "6.41"
        },
        {
          "name": "MADURAVAYAL -- RATION SHOP",
          "time": "6.45"
        },
        {
          "name": "ERIKARAI",
          "time": "6.46"
        },
        {
          "name": "VANAGARAM -- FISH MARKET OPOSITE",
          "time": "6.47"
        },
        {
          "name": "VEMPULIYAMMAN -- KOVIL",
          "time": "6.49"
        },
        {
          "name": "VELAPANCHAVADI",
          "time": "6.50"
        },
        {
          "name": "POONAMALLI -- BUS DEPOT",
          "time": "6.50"
        },
        {
          "name": "AMPATTUR -- TELEPHONE EXCHANCE",
          "time": "6.10"
        },
        {
          "name": "KORATTUR -- 41 D BUS STAND",
          "time": "6.25"
        },
        {
          "name": "PADI -- KORATTUR SIGNAL",
          "time": "6.28"
        },
        {
          "name": "PADI -- BRITANNIA BUS STOP",
          "time": "6.30"
        },
        {
          "name": "MANNURTTAI -- BUS STOP",
          "time": "6.32"
        },
        {
          "name": "AMPATTUR -- ESTATE BUS STOP",
          "time": "6.35"
        },
        {
          "name": "MOGAPPAIRV -- WEST MGR STATUE",
          "time": "6.38"
        },
        {
          "name": "MOGAPPAIRV -- WEST BUS STAND",
          "time": "6.40"
        },
        {
          "name": "MOGAPPAIRV -- WEST DR SUPER MARKET",
          "time": "6.42"
        },
        {
          "name": "GOLDEN -- FLATS GOLDEN FLATS",
          "time": "6.28"
        },
        {
          "name": "DAV -- SCHOOL DAV SCHOOL",
          "time": "6.28"
        },
        {
          "name": "T.S -- KRISHNA NAGAR T.S KRISHNA NAGAR",
          "time": "6.28"
        },
        {
          "name": "COLLECTOR -- NAGAR COLLECTOR NAGAR",
          "time": "6.33"
        },
        {
          "name": "MMM -- SIGNAL BUS STOP MMM SIGNAL BUS STOP",
          "time": "6.33"
        },
        {
          "name": "VARIETY -- CENTER VARIETY CENTER",
          "time": "6.35"
        },
        {
          "name": "MASUTHI -- BUS STOP MASUTHI BUS STOP",
          "time": "6.35"
        },
        {
          "name": "7H -- BUS STOP 7H BUS STOP",
          "time": "6.35"
        },
        {
          "name": "AMBEDKAR -- GROUND AMBEDKAR GROUND",
          "time": "6.40"
        },
        {
          "name": "MUGAPIR -- WEST MUGAPIR WEST",
          "time": "6.35"
        },
        {
          "name": "VELAMMAL -- WEST VELAMMAL WEST",
          "time": "6.35"
        },
        {
          "name": "KARIYANCHAVADI -- KARIYANCHAVADI",
          "time": "6.55"
        },
        {
          "name": "KUMANANCHAVADI -- KUMANANCHAVADI",
          "time": "6.55"
        },
        {
          "name": "MOGAPPAIR -- WEST ICIC/HDFC BANK",
          "time": "6.40"
        },
        {
          "name": "MOGAPPAIR -- WEST KOVAI PAZHAMUDIR NILAYAM",
          "time": "6.41"
        },
        {
          "name": "MOGAPPAIR -- WEST MUGAPPAIR WEST BUS STAND",
          "time": "6.41"
        },
        {
          "name": "MOGAPPAIR -- WEST D.R SUPER MARKET",
          "time": "6.43"
        },
        {
          "name": "MOGAPPAIR -- WEST CHAI WALA",
          "time": "6.45"
        },
        {
          "name": "MOGAPPAIR -- WEST VELAMMAL HALL",
          "time": "6.46"
        }
      ]
    },
    {
      "id": 18,
      "routeNo": "ROUTE NO.18",
      "routeName": "AYAPPAKAM",
      "stops": [
        {
          "name": "AYAPPAKAM -- AYANAMBAKKAM",
          "time": "6.10"
        },
        {
          "name": "ATHPET -- STOP",
          "time": "6.15"
        },
        {
          "name": "ICF -- COLONY CHURCH BUS STOP",
          "time": "6.20"
        },
        {
          "name": "GANGA -- SWEETS BUS STOP",
          "time": "6.20"
        },
        {
          "name": "ICMR -- BUS STOP",
          "time": "6.25"
        },
        {
          "name": "SAI -- BABA KOVIL BUS STOP",
          "time": "6.25"
        },
        {
          "name": "TIRUVERKADU -- MAIN ROAD PETROL BUNK",
          "time": "6.30"
        },
        {
          "name": "SELLIYAMMAN -- NAGAR BUS STOP",
          "time": "6.30"
        },
        {
          "name": "BUS -- STOP",
          "time": "6.35"
        }
      ]
    },
    {
      "id": 19,
      "routeNo": "ROUTE NO.19",
      "routeName": "THIRUVERKADU",
      "stops": [
        {
          "name": "AYANAMBAKKAM -- BUS STOP",
          "time": "6.15"
        },
        {
          "name": "VGN -- APARTMENT VGN APARTMENT",
          "time": "6.35"
        },
        {
          "name": "KOLADI -- HP PETROL BUNK",
          "time": "6.40"
        },
        {
          "name": "THIRUVERKADU -- UDHAVUM KARANGAL",
          "time": "6.42"
        },
        {
          "name": "THIRUVERKADU -- THIRUVERKADU BUS STAND",
          "time": "6.45"
        },
        {
          "name": "THIRUVERKADU -- PALLIKUPPAM STOP",
          "time": "6.50"
        },
        {
          "name": "PARIVAKKAM -- SIGNAL",
          "time": "6.55"
        },
        {
          "name": "POONAMALLEE -- BYPASS",
          "time": "6.58"
        },
        {
          "name": "MALAYAMBAKKAM -- SERVICE ROAD",
          "time": "7.00"
        },
        {
          "name": "PADYANALLUR -- BUS STOP",
          "time": "5.55"
        },
        {
          "name": "M -- A NAGAR BUS STOP",
          "time": "5.55"
        },
        {
          "name": "REDHILLS -- BUS STOP",
          "time": "6.00"
        },
        {
          "name": "KAVANGARAI -- BUS STOP",
          "time": "6.10"
        },
        {
          "name": "PUZHAL -- JAIL STOP",
          "time": "6.10"
        },
        {
          "name": "PUZHAL -- CAMP",
          "time": "6.10"
        },
        {
          "name": "VELAMMAL -- COLLEGE BUS STOP",
          "time": "6.15"
        },
        {
          "name": "SURAPET -- BUS STOP",
          "time": "6.15"
        },
        {
          "name": "SURAPET -- IYYAPPAN TEMPLE",
          "time": "6.15"
        },
        {
          "name": "SURAPET -- MAIN ROAD",
          "time": "6.15"
        },
        {
          "name": "SHANMUGAPURAM -- BUS STOP",
          "time": "6.25"
        },
        {
          "name": "KALLIKUPPAM -- TEA SHOP",
          "time": "6.30"
        },
        {
          "name": "KALLIKUPPAM -- ARCH BUS STOP",
          "time": "6.32"
        },
        {
          "name": "KALLIKUPPAM -- WIRELESS",
          "time": "6.34"
        },
        {
          "name": "MALIGA -- MAHAL",
          "time": "6.36"
        },
        {
          "name": "PUDUR -- BUS STOP",
          "time": "6.38"
        },
        {
          "name": "AMATTUR -- ORAGADAM AMATTUR",
          "time": "6.40"
        },
        {
          "name": "AMBATTUR -- OT AMBATTUR OT",
          "time": "6.25"
        },
        {
          "name": "STEDFORD -- HOSPITAL STEDFORD HOSPITAL",
          "time": "6.25"
        },
        {
          "name": "SARASWATH -- NAGAR SARASWATH NAGAR",
          "time": "6.26"
        },
        {
          "name": "MANIKANDAPURAM -- MANIKANDAPURAM",
          "time": "6.26"
        },
        {
          "name": "THIRUMAULLAIVOYAL -- BUS STOP",
          "time": "6.25"
        },
        {
          "name": "VAISHNAVI -- NAGAR",
          "time": "6.25"
        },
        {
          "name": "MURUGAPPA -- POLYTECHNIC",
          "time": "6.26"
        },
        {
          "name": "AVADI -- CHECK POST",
          "time": "6.30"
        },
        {
          "name": "SEKKADU -- BUS STOP",
          "time": "6.35"
        },
        {
          "name": "SEKKADU -- ANJANAYAR TEMPLE",
          "time": "6.37"
        },
        {
          "name": "MANAVAL -- NAGAR BUS STOP",
          "time": "6.10"
        },
        {
          "name": "THIRUVALLUR -- GRT OIL MILL",
          "time": "6.12"
        },
        {
          "name": "THIRUVALLUR -- RAILWAY SATATION",
          "time": "6.12"
        },
        {
          "name": "THIRUVALLUR -- GH",
          "time": "6.12"
        },
        {
          "name": "THIRUVALLUR -- LIC",
          "time": "6.12"
        },
        {
          "name": "THIRUVALLUR -- KAKKALUR BUS STOP",
          "time": "6.19"
        },
        {
          "name": "TIRUMAZHAI -- BUS STOP",
          "time": "6.20"
        },
        {
          "name": "NAZATHERPETTAI -- BUS STOP",
          "time": "6.20"
        },
        {
          "name": "KAKKALUR -- KAKKALUR BYE PASS",
          "time": "6.20"
        },
        {
          "name": "SEVAPETTAI -- BUS STOP",
          "time": "6.35"
        },
        {
          "name": "",
          "time": "6.40"
        },
        {
          "name": "VEPPAMPATTU -- BUS STOP",
          "time": "6.41"
        },
        {
          "name": "THIRUNINRAVUR -- RAILWAY STATION",
          "time": "6.45"
        },
        {
          "name": "GANDHI -- SILAI",
          "time": "6.48"
        },
        {
          "name": "JAYA -- SCHOOL",
          "time": "6.50"
        },
        {
          "name": "NEMILICHERY",
          "time": "7.00"
        }
      ]
    },
    {
      "id": 26,
      "routeNo": "ROUTE NO.26",
      "routeName": "MITTANEMILI",
      "stops": [
        {
          "name": "VEERAPURAM -- MORAI MATHA KOVIL",
          "time": "5.50"
        },
        {
          "name": "STOP",
          "time": "6.00"
        },
        {
          "name": "MITTANEMILI -- STOP",
          "time": "6.05"
        },
        {
          "name": "CRPF -- ROAD JUNCTION JUNCTION ROAD",
          "time": "6.10"
        },
        {
          "name": "CRPF -- MAIN GATE IAF AVADI",
          "time": "6.12"
        },
        {
          "name": "VEL -- TECH VEL TECH JUNCTION",
          "time": "6.15"
        },
        {
          "name": "KANNADAPALAYAM -- JUNCTION JUNCTION",
          "time": "6.15"
        },
        {
          "name": "NAZARETH -- COLLEGE STOP",
          "time": "6.17"
        },
        {
          "name": "KOVILPATHAGAI -- STOP",
          "time": "6.20"
        },
        {
          "name": "AJAY -- STADIUM STOP",
          "time": "6.25"
        },
        {
          "name": "AVADI -- BUS STOP",
          "time": "6.30"
        },
        {
          "name": "AVADI -- PONNU SUPER MARKET",
          "time": "6.30"
        },
        {
          "name": "AVADI -- RAMARATHINA",
          "time": "6.35"
        },
        {
          "name": "AVADI -- CHECK POST",
          "time": "6.40"
        },
        {
          "name": "KAVARAPALAYAM",
          "time": "6.45"
        },
        {
          "name": "SAKKADU",
          "time": "6.50"
        },
        {
          "name": "HINDU -- CLG",
          "time": "6.55"
        },
        {
          "name": "PATTABIRAM",
          "time": "6.55"
        },
        {
          "name": "AVADI -- JB ESTATE",
          "time": "6.40"
        },
        {
          "name": "AVADI -- MURTHY NAGAR",
          "time": "6.42"
        },
        {
          "name": "AVADI -- GOVARTHAGIRI BUS STOP",
          "time": "6.43"
        },
        {
          "name": "AVADI -- IYYANGULAM",
          "time": "6.44"
        },
        {
          "name": "AVADI -- PARUTHIPATTU APARTMENT",
          "time": "6.45"
        },
        {
          "name": "AVADI -- MAX",
          "time": "6.46"
        },
        {
          "name": "AVADI -- PARUTHIPATTU CHECK POST",
          "time": "6.48"
        },
        {
          "name": "KADUVETTI -- KADUVETTI BUS STOP",
          "time": "6.50"
        },
        {
          "name": "SENEERKUPPAM -- SENEERKUPPAM EB",
          "time": "6.55"
        },
        {
          "name": "KARAYANCHAVADI -- KARAYANCHAVADI",
          "time": "6.57"
        }
      ]
    },
    {
      "id": 29,
      "routeNo": "ROUTE NO.29",
      "routeName": "CHINNA KANCHIPURAM",
      "stops": [
        {
          "name": "IYANKULAM -- KOOTROAD",
          "time": "5.50"
        },
        {
          "name": "SEVILIMEDU -- STOP",
          "time": "5.53"
        },
        {
          "name": "ORRIAKI -- BUS STOP",
          "time": "5.55"
        },
        {
          "name": "GEETHAI -- MANDAPAM BUS STOP",
          "time": "6.10"
        },
        {
          "name": "RANGASAMY -- KULAM BUS STOP",
          "time": "6.15"
        },
        {
          "name": "PADAPAI -- BUS STOP",
          "time": "6.45"
        },
        {
          "name": "MANNIVAKKAM -- (ATTAI COMPANY) BUS STOP",
          "time": "6.50"
        }
      ]
    },
    {
      "id": 30,
      "routeNo": "ROUTE NO.30",
      "routeName": "BIG KANCHIPURAM",
      "stops": [
        {
          "name": "GYM -- NAGAR BHARAT PETROL BUNK",
          "time": "6.05"
        },
        {
          "name": "COLLECTOR -- OFFICE BUS STOP",
          "time": "6.10"
        },
        {
          "name": "MOONGIL -- MANDAPAM BUS STOP",
          "time": "6.15"
        },
        {
          "name": "KANCHIPURAM -- BUS STAND BUS STAND (ABIRAMI HOTEL)",
          "time": "6.20"
        },
        {
          "name": "POOKADAI -- SATHIRAM JUNCTION",
          "time": "6.25"
        },
        {
          "name": "KAMALA -- STREET SIGNAL",
          "time": "6.28"
        },
        {
          "name": "NEW -- RAILWAY STATION STOP (FISH MARKET)",
          "time": "6.30"
        }
      ]
    },
    {
      "id": 31,
      "routeNo": "ROUTE NO.31",
      "routeName": "ARCOT",
      "stops": [
        {
          "name": "ARCOT -- SSS COLLEGE",
          "time": "5.30"
        },
        {
          "name": "MUTHUKADI",
          "time": "5.35"
        },
        {
          "name": "WALAJI",
          "time": "5.40"
        },
        {
          "name": "TOLL",
          "time": "5.42"
        },
        {
          "name": "MALAIMEDU -- SUMAITHANGAI",
          "time": "5.45"
        },
        {
          "name": "KAVERIPAKKAM",
          "time": "5.50"
        },
        {
          "name": "OCHERI",
          "time": "6.00"
        },
        {
          "name": "WHITE -- GATE",
          "time": "6.15"
        },
        {
          "name": "SUNGUVARCHATIRAM",
          "time": "6.35"
        },
        {
          "name": "SAINT -- GOBINT",
          "time": "6.40"
        },
        {
          "name": "SRIPERUMBATHUR -- FIRST ARCH",
          "time": "6.50"
        },
        {
          "name": "SECOND -- ARCH",
          "time": "6.55"
        },
        {
          "name": "RIYAN -- HOTEL",
          "time": "7.00"
        }
      ]
    },
    {
      "id": 32,
      "routeNo": "ROUTE NO.32",
      "routeName": "CHENGALPAT",
      "stops": [
        {
          "name": "CHENGALPAT -- GH",
          "time": "6.00"
        },
        {
          "name": "RAATNA -- KINARU RAATNA KINARU",
          "time": "6.05"
        },
        {
          "name": "CHENGALPAT -- NEW BUS STAND",
          "time": "6.10"
        },
        {
          "name": "CHENGALPAT -- OLD BUS STAND",
          "time": "6.15"
        },
        {
          "name": "CHENGALPAT -- BYPASS",
          "time": "6.20"
        },
        {
          "name": "CHENGALPAT -- MAHINDRA CITY",
          "time": "6.23"
        },
        {
          "name": "SINGAPERUMAL -- KOVIL SIGNAL",
          "time": "6.25"
        },
        {
          "name": "SINGAPERUMAL -- KOVIL MALROSAPURAM SIGNAL",
          "time": "6.27"
        },
        {
          "name": "KEEZHAKARANAI -- BUS STOP",
          "time": "6.28"
        }
      ]
    },
    {
      "id": 33,
      "routeNo": "ROUTE NO.33",
      "routeName": "MARAIMALAI NAGAR",
      "stops": [
        {
          "name": "MARAIMALAI -- NAGAR RAILWAY STATION",
          "time": "6.30"
        },
        {
          "name": "MARAIMALAI -- NAGAR BUS STOP",
          "time": "6.30"
        },
        {
          "name": "KAATTANKULATHUR -- BUS STOP",
          "time": "6.32"
        },
        {
          "name": "POTHERI -- POTHERI SIGNAL",
          "time": "6.34"
        },
        {
          "name": "THAILAVARAM -- THAILAVARAM SIGNAL",
          "time": "6.36"
        },
        {
          "name": "OORAPAKKAM -- SCHOOL STOPPING",
          "time": "6.47"
        },
        {
          "name": "GUDUVANCHERI -- SIGNAL",
          "time": "6.35"
        },
        {
          "name": "URAPPAKKAM -- KARNI SIGNAL",
          "time": "6.44"
        },
        {
          "name": "URAPPAKKAM -- TEA SHOPE",
          "time": "6.45"
        },
        {
          "name": "NEW -- PERUNGALATHUR RAILWAY GATE",
          "time": "6.55"
        },
        {
          "name": "NEW -- PERUNGALATHUR ARIKARI BUS STOP",
          "time": "6.56"
        },
        {
          "name": "NAVALUR -- BUS STOP",
          "time": "6.00"
        },
        {
          "name": "KAZHIPATTUR -- BUS STOP",
          "time": "6.05"
        },
        {
          "name": "PADUR -- BUS STOP",
          "time": "6.07"
        },
        {
          "name": "PADUR -- CHETTINADU HOSPITAL",
          "time": "6.10"
        },
        {
          "name": "KELAMBAKKAM -- GH BUS STOP",
          "time": "6.15"
        },
        {
          "name": "PUDHUPAKKAM -- THAIYUR BUS STOP",
          "time": "6.15"
        },
        {
          "name": "PUDHUPAKKAM -- BUS STOP",
          "time": "6.20"
        },
        {
          "name": "MAMBAKKAM -- BUS STOP",
          "time": "6.25"
        },
        {
          "name": "KEEZHAKOTTAIUR -- BUS STOP",
          "time": "6.30"
        },
        {
          "name": "MEALLAKOTTAIUR -- BUS STOP",
          "time": "6.30"
        },
        {
          "name": "KANDIGAI -- BUS STOP",
          "time": "6.35"
        },
        {
          "name": "KOLAPAKKAM -- SIGNAL",
          "time": "6.40"
        },
        {
          "name": "VANDALOOR -- VANDALOOR",
          "time": "6.45"
        },
        {
          "name": "VANDALOOR -- ZOO RAILWAY GATE",
          "time": "6.45"
        },
        {
          "name": "PERUGALATHUR -- RAILWAY GATE",
          "time": "6.50"
        },
        {
          "name": "PERUGALATHUR -- LAKE",
          "time": "6.50"
        }
      ]
    },
    {
      "id": 36,
      "routeNo": "ROUTE NO.36",
      "routeName": "PERUNGALATHUR (NEW)",
      "stops": [
        {
          "name": "NEW -- PERUNGALATHUR SRI RAM GATE",
          "time": "6.40"
        },
        {
          "name": "IRUMBULIYUR -- IRUMBULIYUR SIGNAL POINT",
          "time": "6.45"
        },
        {
          "name": "KRISHNA -- NAGAR MANO HOSPITAL",
          "time": "6.50"
        },
        {
          "name": "OLD -- PERUNGALATUR",
          "time": "6.52"
        },
        {
          "name": "OLD -- PERUNGALATUR AMBEDHKAR STATUE",
          "time": "6.53"
        },
        {
          "name": "AADHI -- NAGAR AADHI NAGAR BUS STOP",
          "time": "6.55"
        },
        {
          "name": "LAKSHMI -- NAGAR (MUDICHUR) LAKSHMI NAGAR BUS STOP",
          "time": "6.55"
        },
        {
          "name": "HASTHINAPURAM -- BUS STOP",
          "time": "6.40"
        },
        {
          "name": "HASTHINAPURAM -- KUMARAN KUNDRAM KOVIL",
          "time": "6.40"
        },
        {
          "name": "CHROMEPET -- LALITHAA JEWELLERY",
          "time": "6.45"
        },
        {
          "name": "CHROMEPET -- BUS STAND POORIVIKA MOBILE SHOP",
          "time": "6.45"
        }
      ]
    },
    {
      "id": 38,
      "routeNo": "ROUTE NO.38",
      "routeName": "THIRUVANMIYUR",
      "stops": [
        {
          "name": "THIRUVANMIYUR -- BUS DEPOT",
          "time": "5.55"
        },
        {
          "name": "THIRUVANMIYUR -- R.T.O OFFICE",
          "time": "6.00"
        },
        {
          "name": "PALAVAKKAM -- GOVT. SCHOOL",
          "time": "6.10"
        },
        {
          "name": "NEENJAMBAKKAM -- BUS STOP",
          "time": "6.20"
        },
        {
          "name": "NEELANKARAI -- BUS STOP",
          "time": "6.25"
        },
        {
          "name": "AKKARAI -- WATER TANK",
          "time": "6.30"
        },
        {
          "name": "SHOLINGANALLUR -- TOLL GATE",
          "time": "6.30"
        },
        {
          "name": "SHOLINGANALLUR -- AAVIN BOOTH",
          "time": "6.35"
        },
        {
          "name": "SHOLINGANALLUR -- BUS STOP",
          "time": "6.35"
        },
        {
          "name": "PERUMBAKKAM -- BUS STOP",
          "time": "6.40"
        },
        {
          "name": "MEDAVAKKAM -- KOOT ROAD AINJAPPAR HOTEL",
          "time": "6.25"
        },
        {
          "name": "VIJAYA -- NAGAR BUS STOP",
          "time": "6.27"
        },
        {
          "name": "SANTHOSAPURAM -- BUST STOP",
          "time": "6.30"
        },
        {
          "name": "GOWRIVAKKAM -- SIVET CLG",
          "time": "6.30"
        },
        {
          "name": "SEMBAKKAM -- SWIMMING POOL",
          "time": "6.35"
        },
        {
          "name": "KAMARAJAPURAM -- BUS STOP",
          "time": "6.37"
        },
        {
          "name": "RAJAKILPAKKAM -- SHELL PETROL BUNK",
          "time": "6.38"
        },
        {
          "name": "MAHALAKSHMI -- NAGAR BUS STOP",
          "time": "6.40"
        },
        {
          "name": "KAUVERY -- HOSPITAL",
          "time": "6.05"
        },
        {
          "name": "VINIYAGAR -- PURAM BUS STOP",
          "time": "6.06"
        },
        {
          "name": "SUNNABAUKOLATUR -- SUNNABAUKOLATUR BUS STAND",
          "time": "6.07"
        },
        {
          "name": "KAMATCHI -- HOSPTIAL",
          "time": "6.10"
        },
        {
          "name": "NARAYANAPURAM -- BUS STOP",
          "time": "6.15"
        },
        {
          "name": "PALLIKARANAI -- POLICE BOOTH",
          "time": "6.20"
        },
        {
          "name": "OIL -- MILL",
          "time": "6.21"
        },
        {
          "name": "MEDAVAKKAM -- JAICHANDRANSHOP",
          "time": "6.25"
        },
        {
          "name": "SITHALAPAKKAM -- SITHALAPAKKAM BUS STOP",
          "time": "6.05"
        },
        {
          "name": "SITHALAPAKKAM -- JAYANAGAR BUS STOP",
          "time": "6.05"
        },
        {
          "name": "SITHALAPAKKAM -- HOUSING BOARD",
          "time": "6.10"
        },
        {
          "name": "NOOTHANCERRY -- NOOTHANCERRY",
          "time": "6.15"
        },
        {
          "name": "JYOTHI -- NAGAR JYOTHI NAGAR",
          "time": "6.20"
        },
        {
          "name": "MADAMBAKKAM -- MADAMBAKKAM",
          "time": "6.20"
        },
        {
          "name": "KOZHIPANNAI -- KOZHIPANNAI",
          "time": "6.25"
        },
        {
          "name": "SUDARSON -- NAGAR SUDARSON NAGAR",
          "time": "6.30"
        },
        {
          "name": "SELAIYUR -- BUS STOP",
          "time": "6.40"
        },
        {
          "name": "SANKARA -- SCHOOL",
          "time": "6.45"
        }
      ]
    },
    {
      "id": 42,
      "routeNo": "ROUTE NO.42",
      "routeName": "MAPPEDU",
      "stops": [
        {
          "name": "AGARAM -- AGARAM BUS STOP",
          "time": "6.15"
        },
        {
          "name": "MAPPEDU -- MAPPEDU JUNCTION",
          "time": "6.20"
        },
        {
          "name": "BHARATH -- COLLEGE BHARATH COLLEGE BUS STOP",
          "time": "6.25"
        },
        {
          "name": "INDHIRA -- NAGAR INDHIRA NAGAR BUS STOP",
          "time": "6.25"
        },
        {
          "name": "CAMP -- ROAD CAMP ROAD BUS STOP",
          "time": "6.30"
        },
        {
          "name": "AMBEDHKAR -- NAGAR SELAYUR BUS STOP",
          "time": "6.35"
        },
        {
          "name": "TAMBARAM -- KOLAM KOLAM BUS STOP",
          "time": "6.45"
        }
      ]
    },
    {
      "id": 43,
      "routeNo": "ROUTE NO.43",
      "routeName": "KOVILAMBAKKAM",
      "stops": [
        {
          "name": "KOVILAMBAKKAM -- KOVILAMBAKKAM STOP",
          "time": "6.20"
        },
        {
          "name": "NANMANGALAM -- NANMANGALAM STOP",
          "time": "6.25"
        },
        {
          "name": "VADAKUPATTU -- VADAKUPATTU STOP",
          "time": "6.30"
        },
        {
          "name": "EAST -- TAMBARAM MCC COLLEGE BUS STOP",
          "time": "6.45"
        },
        {
          "name": "WEST -- TAMBARAM VINAYAGAR KOVIL STOP",
          "time": "6.50"
        },
        {
          "name": "WEST -- TAMBARAM",
          "time": "6.50"
        },
        {
          "name": "KISHKINTA -- NAGAR KISHKINTA JUNCTION",
          "time": "6.58"
        }
      ]
    },
    {
      "id": 44,
      "routeNo": "ROUTE NO.44",
      "routeName": "MEPZ",
      "stops": [
        {
          "name": "CHROMPET",
          "time": "6.40"
        },
        {
          "name": "CHROMPET -- INDIRA COTTON MILLS",
          "time": "6.55"
        },
        {
          "name": "CHROMPET -- BUS STAND",
          "time": "6.55"
        },
        {
          "name": "CHROMPET -- SARAVANA STORES",
          "time": "7.00"
        },
        {
          "name": "TAMBARAM -- BUS STAND POST OFFICE",
          "time": "6.50"
        },
        {
          "name": "TAMBARAM",
          "time": "6.52"
        },
        {
          "name": "TAMBARAM -- BHARAT PETROL BUNK",
          "time": "6.54"
        },
        {
          "name": "MEPZ -- GRT",
          "time": "6.56"
        },
        {
          "name": "MEPZ -- BUS STAND",
          "time": "6.57"
        },
        {
          "name": "CHROMPET -- MIT GATE",
          "time": "7.00"
        },
        {
          "name": "CHROMPET -- BUS STOP",
          "time": "7.02"
        },
        {
          "name": "CHROMPET -- SARAVANA STORE",
          "time": "7.03"
        }
      ]
    },
    {
      "id": 46,
      "routeNo": "ROUTE NO.46",
      "routeName": "PALLAVARAM",
      "stops": [
        {
          "name": "BHARATHI -- NAGAR BABY NAGAR",
          "time": "6.05"
        },
        {
          "name": "VELACERY -- VIJAYA NAGAR BUS STAND",
          "time": "6.10"
        },
        {
          "name": "VELACERY -- 100FT ROAD GRT",
          "time": "6.12"
        },
        {
          "name": "VELACERY -- 100FT ROAD MURGAN MAHAL",
          "time": "6.14"
        },
        {
          "name": "VELACERY -- 100FT ROAD ARIKARI GUPTA BHAVAN",
          "time": "6.16"
        },
        {
          "name": "VELACERY -- PHENOIX MALL",
          "time": "6.18"
        },
        {
          "name": "VELACERY -- CHEAK POST",
          "time": "6.20"
        }
      ]
    },
    {
      "id": 48,
      "routeNo": "ROUTE NO.48",
      "routeName": "ADAMBAKKAM",
      "stops": [
        {
          "name": "NGO -- COLONY RACE COURSE",
          "time": "6.20"
        },
        {
          "name": "ADAMBAKKAM -- DEPOT STOP",
          "time": "6.20"
        },
        {
          "name": "KAKKAN -- BRIDGE STOP",
          "time": "6.22"
        },
        {
          "name": "BRINDAVAN -- NAGAR STOP",
          "time": "6.24"
        },
        {
          "name": "ADAMBAKKAM -- PRIME CARE",
          "time": "6.25"
        },
        {
          "name": "AALANDUR -- COURT STOP",
          "time": "6.25"
        },
        {
          "name": "G.S.T -- ROAD SARAVANA STORES",
          "time": "6.30"
        },
        {
          "name": "SANTHI -- PETROL BUNK SIGNAL",
          "time": "6.30"
        },
        {
          "name": "VELACHERRY -- KAIVELI SIGNAL BUS STOP",
          "time": "6.10"
        },
        {
          "name": "PUZHTHIVAKKAM -- POLICE BOOTH",
          "time": "6.15"
        },
        {
          "name": "VANAVAMPET -- PERUMALKOVIL",
          "time": "6.18"
        },
        {
          "name": "NANGANALLUR -- VV MART",
          "time": "6.20"
        },
        {
          "name": "NAGANALLUR -- INDEPENDENCE PARK",
          "time": "6.25"
        },
        {
          "name": "PALAVANTHANGAL -- SUBWAY VEMBULI AMMAN KOVIL BUS STOP",
          "time": "6.30"
        },
        {
          "name": "MENAMPAKKAM -- METRO HONDA SHOWROOM",
          "time": "6.35"
        }
      ]
    },
    {
      "id": 50,
      "routeNo": "ROUTE NO.50",
      "routeName": "MADIPAKKAM",
      "stops": [
        {
          "name": "KAIVELI",
          "time": "6.30"
        },
        {
          "name": "RAM -- NAGAR",
          "time": "6.32"
        },
        {
          "name": "MADIPAKKAM -- PONIYAMMAN KOIL",
          "time": "6.40"
        }
      ]
    },
    {
      "id": 51,
      "routeNo": "ROUTE NO.51",
      "routeName": "TIRUNEERMALAI",
      "stops": [
        {
          "name": "KEEZH -- KATTALAI STOP",
          "time": "6.35"
        },
        {
          "name": "EECHANGAADU -- STOP",
          "time": "6.40"
        },
        {
          "name": "VELMURUGAN -- TOWER STOP",
          "time": "6.43"
        },
        {
          "name": "NARAYANA -- SCHOOL STOP",
          "time": "6.45"
        },
        {
          "name": "ALLIANCE -- STOP",
          "time": "6.47"
        },
        {
          "name": "VELS -- UNIVERSITY STOP",
          "time": "6.47"
        },
        {
          "name": "SARAVANA -- SELVARATHNAM (VELS) SIGNAL STOP",
          "time": "6.49"
        },
        {
          "name": "CHROMPET -- BUS STOP",
          "time": "6.51"
        },
        {
          "name": "NAGALKANI -- BUS STOP",
          "time": "6.55"
        },
        {
          "name": "PONDS -- MGR STATUE",
          "time": "6.45"
        },
        {
          "name": "NAGELKENI -- NAGELKENI",
          "time": "6.47"
        },
        {
          "name": "LAKSHMIPURAM -- NIAGARA PETROL BUNK",
          "time": "6.48"
        },
        {
          "name": "TIRUNEERMALAI -- NIAGARA PETROL BUNK",
          "time": "6.48"
        },
        {
          "name": "TIRUNEERMALAI -- (JAIN) TIRUNEERMALAI ROAD (JAIN)",
          "time": "6.49"
        },
        {
          "name": "THIRUMUDIVAKKAM -- AMARAM PRAKASM APARTMENT",
          "time": "6.55"
        },
        {
          "name": "NANDAMPAKKAM -- ANGALAMMAN KOVIL",
          "time": "7.00"
        },
        {
          "name": "NANDAMPAKKAM -- PERIYAR NAGAR",
          "time": "7.05"
        },
        {
          "name": "NANDAMPAKKAM -- ANJUGAM NAGAR BUS STOP",
          "time": "7.06"
        },
        {
          "name": "POZHICHALUR -- BUS STOP",
          "time": "6.45"
        },
        {
          "name": "POZHICHALUR -- SIVAN TEMPLE",
          "time": "6.48"
        },
        {
          "name": "POZHICHALUR -- VENKATEWARA NAGAR",
          "time": "6.50"
        },
        {
          "name": "POZHICHALUR -- NEHRU NAGAR",
          "time": "6.55"
        },
        {
          "name": "POZHICHALUR -- INDIAN GAS COMANY",
          "time": "6.58"
        },
        {
          "name": "ANAKAPUTHUR -- GOVERNMENT SCHOOL",
          "time": "7.05"
        },
        {
          "name": "ANAKAPUTHUR -- AMMAN KOVIL",
          "time": "7.07"
        },
        {
          "name": "ANAKAPUTHUR -- VALCO CINEMAS",
          "time": "7.10"
        },
        {
          "name": "ANAKAPUTHUR -- ANAKAPUTHUR BUS STOP",
          "time": "7.10"
        },
        {
          "name": "METHA -- NAGAR METHA NAGAR BUS STOP",
          "time": "7.15"
        }
      ]
    },
    {
      "id": 54,
      "routeNo": "ROUTE NO.54",
      "routeName": "THORAIPAKKAM",
      "stops": [
        {
          "name": "THORAIPAKKAM -- KANNAGI NAGAR SIGNAL",
          "time": "5.45"
        },
        {
          "name": "THORAIPAKKAM -- GEETHAM HOTEL",
          "time": "5.47"
        },
        {
          "name": "THORAIPAKKAM -- TEA KADAI POINT",
          "time": "5.50"
        },
        {
          "name": "PERUNGUDI -- PERUNGUDI BUS STOP",
          "time": "5.55"
        },
        {
          "name": "KANDHANCHAVADI",
          "time": "6.00"
        },
        {
          "name": "TARAMANI -- SRP TOOLS SIGNAL",
          "time": "6.05"
        },
        {
          "name": "TIRUVANMIYUR -- RAILWAY STATION TIDAL PARK BUS STOP",
          "time": "6.07"
        },
        {
          "name": "INDHIRA -- NAGAR RAILWAY STATION KANAGAM",
          "time": "6.10"
        },
        {
          "name": "ADYAR",
          "time": "6.12"
        },
        {
          "name": "ADYAR -- IIT (MADRAS) GATE",
          "time": "6.15"
        },
        {
          "name": "ADYAR",
          "time": "6.20"
        },
        {
          "name": "GUINDY",
          "time": "6.25"
        },
        {
          "name": "GUINDY -- (KATHIPARA) BUTT ROAD BUS STOP",
          "time": "6.30"
        },
        {
          "name": "GUINDY -- ST. THOMAS MOUNT",
          "time": "6.30"
        },
        {
          "name": "CHENNAI -- TRADE CENTRE",
          "time": "6.35"
        },
        {
          "name": "MIOT -- (RAMAPURAM)",
          "time": "6.40"
        }
      ]
    },
    {
      "id": 55,
      "routeNo": "ROUTE NO.55",
      "routeName": "SAIDAPET",
      "stops": [
        {
          "name": "SAIDAPET -- CHINNA MALAI BUS STOP",
          "time": "6.10"
        },
        {
          "name": "SAIDAPET -- KALAIGNAR ARCH BUS STOP",
          "time": "6.12"
        },
        {
          "name": "SAIDAPET -- SAIDAPET METRO BUS STOP",
          "time": "6.15"
        },
        {
          "name": "SAIDAPET -- HYUNDAI SHOWROOM",
          "time": "6.17"
        },
        {
          "name": "T. -- NAGAR KANNAMA PETTAI BUS STOP",
          "time": "6.19"
        },
        {
          "name": "SAIDAPET -- (WEST MAMBALAM) ARANGANATHA SUB WAY",
          "time": "6.25"
        },
        {
          "name": "WEST -- MAMBALAM SRINIVASA THEATRE",
          "time": "6.27"
        },
        {
          "name": "SAIDAPET -- (WEST MAMBALAM)",
          "time": "6.30"
        },
        {
          "name": "ASHOK -- NAGAR",
          "time": "6.32"
        },
        {
          "name": "EKKATTUTHANGAL -- NAGAR BUS STOP) \u2013 HYUNDAI",
          "time": "6.35"
        },
        {
          "name": "MUGALIVAKKAM",
          "time": "6.45"
        }
      ]
    },
    {
      "id": 56,
      "routeNo": "ROUTE NO.56",
      "routeName": "ASHOK PILLAR",
      "stops": [
        {
          "name": "ASHOK -- NAGAR KFC",
          "time": "6.10"
        },
        {
          "name": "ASHOK -- NAGAR KAASI THEATRE",
          "time": "6.15"
        },
        {
          "name": "EKKATTUTHANGAL -- JAYA TV BUS STOP",
          "time": "6.20"
        },
        {
          "name": "EKKATTUTHANGAL -- HYUNDAI SHOWROOM",
          "time": "6.25"
        },
        {
          "name": "GUINDY -- (KATHIPARA) BUTT ROAD",
          "time": "6.35"
        },
        {
          "name": "CHENNAI -- TRADING CENTRE NANDHAMBAKKAM",
          "time": "6.40"
        },
        {
          "name": "RAMAPURAM -- RAMAPURAM BUS STOP",
          "time": "6.45"
        },
        {
          "name": "MUGALIVAKKAM -- MUGALIVAKKAM BUS STOP",
          "time": "6.50"
        },
        {
          "name": "KK -- NAGAR SIVAN PARK",
          "time": "6.15"
        },
        {
          "name": "NAGATHAMMAL -- KOIL ST",
          "time": "6.18"
        },
        {
          "name": "THAI -- SATHYA SCHOOL OPP",
          "time": "6.18"
        },
        {
          "name": "DATA -- UDUPI",
          "time": "6.22"
        },
        {
          "name": "MGR -- NAGAR \u2013DATA UDUPI",
          "time": "6.22"
        },
        {
          "name": "PONDICHERY -- GUEST HOUSE",
          "time": "6.30"
        },
        {
          "name": "REDDY -- STREET",
          "time": "6.10"
        },
        {
          "name": "SALIGRAMAM",
          "time": "6.12"
        },
        {
          "name": "NATESAN -- NAGAR",
          "time": "6.15"
        },
        {
          "name": "CHINMAYANAGAR",
          "time": "6.18"
        },
        {
          "name": "KOYEMBEDU -- BUS STAND",
          "time": "6.20"
        },
        {
          "name": "THIRU -- NAGAR",
          "time": "6.25"
        },
        {
          "name": "KARAMBAKKAM -- KARAMBAKKAM",
          "time": "6.48"
        },
        {
          "name": "VANAGARAM -- SRI VARI MAHAL",
          "time": "6.35"
        },
        {
          "name": "MADURAVOYAL -- TOLL GATE TOLL GATE",
          "time": "6.40"
        },
        {
          "name": "AYAPANTHANGAL -- RAMACHANDRA HOSPITAL",
          "time": "6.40"
        },
        {
          "name": "AYAPANTHANGAL -- BUS STOP",
          "time": "6.50"
        },
        {
          "name": "KATTUPAKKM -- BUS STOP",
          "time": "6.50"
        },
        {
          "name": "KATTUPAKKAM -- MARAN GARDEN",
          "time": "6.50"
        },
        {
          "name": "NUMBAL -- BUS STOP",
          "time": "6.55"
        },
        {
          "name": "MANGADU -- BUS STOP",
          "time": "7.05"
        },
        {
          "name": "CHIKKARAYAPURAM -- BUS STOP",
          "time": "7.00"
        },
        {
          "name": "PATTUR -- KOOT ROAD BUS STOP",
          "time": "7.10"
        },
        {
          "name": "PORUR -- SIGNAL",
          "time": "7.00"
        },
        {
          "name": "BAIKADAI -- BUS STOP",
          "time": "7.05"
        },
        {
          "name": "KOVOOR -- EB BUS STOP",
          "time": "7.15"
        },
        {
          "name": "MADHANANTHAPURAM -- NARAYANA SCHOOL",
          "time": "7.05"
        },
        {
          "name": "GUPTA -- BAVAN",
          "time": "7.05"
        },
        {
          "name": "BAI -- KADAI ICICI BANK ATM",
          "time": "7.10"
        },
        {
          "name": "GERUGAMPAKKAM -- BUS STOP",
          "time": "7.10"
        },
        {
          "name": "PERIYAPANICHERRY -- BUS STOP",
          "time": "7.10"
        },
        {
          "name": "ILAKIYA",
          "time": "7.10"
        },
        {
          "name": "KUNDURATHUR -- AMBEDKAR STATUE",
          "time": "7.15"
        },
        {
          "name": "KUNDURATHUR",
          "time": "7.16"
        },
        {
          "name": "KUNDURATHUR -- POLICE STATION OPOSITE",
          "time": "7.16"
        },
        {
          "name": "KUNDURATHUR -- VADALUR FLY OVER BRIGE",
          "time": "7.17"
        },
        {
          "name": "ANJUGAM -- NAAGAR ANJUGAM NAAGAR",
          "time": "7.20"
        },
        {
          "name": "PERIYAR -- NAGAR PERIYAR NAGAR",
          "time": "7.22"
        }
      ]
    }
  ]

  // Update expanded routes whenever search query changes
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      setExpandedRouteIds(new Set());
      return;
    }

    const matchingRouteIds = new Set(
      routes.filter(route =>
        route.stops.some(stop =>
          stop.name.toLowerCase().includes(query)
        )
      ).map(route => route.id)
    );

    setExpandedRouteIds(matchingRouteIds);
  }, [searchQuery]);

  const toggleRouteExpansion = (routeId) => {
    const newExpandedRouteIds = new Set(expandedRouteIds);
    if (newExpandedRouteIds.has(routeId)) {
      newExpandedRouteIds.delete(routeId);
    } else {
      newExpandedRouteIds.add(routeId);
    }
    setExpandedRouteIds(newExpandedRouteIds);
  };

  const filteredRoutes = routes.filter(route => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      route.routeName.toLowerCase().includes(query) ||
      route.stops.some(stop => stop.name.toLowerCase().includes(query))
    );
  });

  // Helper function to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ?
        <span key={index} className="bg-yellow-400/30">{part}</span> :
        part
    );
  };

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <header className="bg-yellow-400 py-3 px-6 shadow-lg relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img
            src="/logo1.png"
            alt="Left Logo"
            className="h-[70px] w-[100px] sm:hidden rounded-full object-contain"
          />
          <img
            src="/logo1.png"
            alt="Left Logo"
            className="hidden sm:block sm:h-[100px] sm:w-[200px] rounded-full object-contain"
          />

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black tracking-wider">
              BUS ROUTE
            </h1>
            <p className="text-black font-medium">Management System</p>
          </div>

          <img
            src="/logo.png"
            alt="Right Logo"
            className="h-[70px] w-[70px] sm:hidden rounded-full object-contain"
          />
          <img
            src="/logo.png"
            alt="Right Logo"
            className="hidden sm:block sm:h-[100px] sm:w-[100px] rounded-full object-contain"
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search routes or stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-yellow-400/20 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:border-yellow-400/40 transition-colors"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-gray-400">
              Found {filteredRoutes.length} {filteredRoutes.length === 1 ? 'route' : 'routes'}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <div key={route.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-colors">
              <div
                className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleRouteExpansion(route.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Bus className="text-yellow-400 h-5 w-5" />
                      <h3 className="text-xl font-semibold text-white">
                        {route.routeNo} - {highlightMatch(route.routeName, searchQuery)}
                      </h3>
                    </div>
                  </div>
                  {expandedRouteIds.has(route.id) ?
                    <ChevronUp className="text-yellow-400 h-5 w-5" /> :
                    <ChevronDown className="text-yellow-400 h-5 w-5" />
                  }
                </div>
              </div>

              {expandedRouteIds.has(route.id) && (
                <div className="border-t border-yellow-400/10 p-4 bg-gray-800">
                  <h4 className="font-medium mb-4 text-yellow-400 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Stops ({route.stops.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {route.stops.map((stop, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 rounded-lg bg-gray-900"
                      >
                        <span className="font-medium text-gray-200">
                          {index + 1}. {highlightMatch(stop.name, searchQuery)}
                        </span>
                        <span className="flex items-center gap-2 text-yellow-400">
                          <Clock className="h-4 w-4" />
                          {stop.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusRouteViewer;