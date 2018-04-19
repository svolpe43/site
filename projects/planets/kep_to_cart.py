
import numpy as np

mu = 6.67408e-11 * 5.97236473e+24
Re = 6378100

#Test vectors
r_test = np.array([Re + 600.0*1000, 0, 50])
v_test = np.array([0, 6.5 * 1000, 0])
t = 0

def cart_2_kep(r_vec,v_vec):
    #1
    h_bar = np.cross(r_vec,v_vec)
    h = np.linalg.norm(h_bar)
    #2
    r = np.linalg.norm(r_vec)
    v = np.linalg.norm(v_vec)
    #3
    E = 0.5*(v**2) - mu/r
    #4
    a = -mu/(2*E)
    #5
    e = np.sqrt(1 - (h**2)/(a*mu))
    #6
    i = np.arccos(h_bar[2]/h)
    #7
    omega_LAN = np.arctan2(h_bar[0],-h_bar[1])
    #8
    #beware of division by zero here
    lat = np.arctan2(np.divide(r_vec[2],(np.sin(i))),\
    (r_vec[0]*np.cos(omega_LAN) + r_vec[1]*np.sin(omega_LAN)))
    #9
    #beware of numerical errors here
    nu = np.arccos(np.round(a*(1 - e**2) - r, decimals = 1)/ \
    np.round(e*r , decimals = 1))
    #10
    omega_AP = lat - nu
    #11
    EA = 2*np.arctan(np.sqrt((1-e)/(1+e)) * np.tan(nu/2))
    #12
    n = np.sqrt(mu/(a**3))
    T = t - (1/n)*(EA - e*np.sin(EA))

    return a,e,i,omega_AP,omega_LAN,T, EA

'''
a - semi-major axis
e - eccentricity
i - inclination
omega_AP - argument of periapsis
omega_LAN - longitude ascending node
T - time of periapsis passage
EA - eccentric anomaly
'''

# def get_orbit(a, e, i, omega_AP, omega_LAN, T):

float mu = G * M;
float E = Mathf.Acos((e + Mathf.Cos(nu)) / (1 + e * Mathf.Cos(nu)));
float Mt = E - e * Mathf.Sin (E);

//Mean anomaly at time t
float T = 2 * Mathf.PI * Mathf.Sqrt(a * a * a / mu); //Orbital period
float deltaT = (T/60) * (t - t0); //divide time increments into 1/60th of the orbital period
Mt = Mt + deltaT * Mathf.Sqrt (mu / Mathf.Pow (a, 3));

# Calculate eccentric anomaly using Newton's method
float F = E - e * Mathf.Sin (E) - Mt;
int j = 0, maxIter = 30;
float delta = 0.000001f;
while (Mathf.Abs(F) > delta && j < maxIter) {
    E = E - F / (1 - e * Mathf.Cos (E));
    F = E - e * Mathf.Sin (E) - Mt;
    j++;
}

//True anomaly
nu = 2 * Mathf.Atan2 (Mathf.Sqrt (1 + e) * Mathf.Sin (E / 2), Mathf.Sqrt (1 - e) * Mathf.Cos (E / 2)); 


def kep_2_cart(a, e, i, omega_AP, omega_LAN, T, EA):

    EA = 2*np.arctan(np.sqrt((1-e)/(1+e)) * np.tan(nu/2))
    #12
    n = np.sqrt(mu/(a**3))
    T = t - (1/n)*(EA - e*np.sin(EA))

    # compute mean anomaly (2 ways)
    # from time of periapsis passage
    MA1 = np.sqrt(mu/(a**3)) * (0 - T)
    # from eccentric anomaly
    MA2 = EA - e * np.sin(EA)

    # true anomaly
    nu = 2 * np.arctan(np.sqrt((1 - e)/(1 + e)) * np.tan(EA / 2))

    # radius
    r = a*(1 - e*np.cos(EA))

    # specific angular momentum
    h = np.sqrt(mu*a * (1 - e**2))

    #6
    Om = omega_LAN
    w =  omega_AP

    #
    X = r*(np.cos(Om)*np.cos(w+nu) - np.sin(Om)*np.sin(w+nu)*np.cos(i))
    Y = r*(np.sin(Om)*np.cos(w+nu) + np.cos(Om)*np.sin(w+nu)*np.cos(i))
    Z = r*(np.sin(i)*np.sin(w+nu))

    #7
    p = a*(1-e**2)

    V_X = (X*h*e/(r*p))*np.sin(nu) - (h/r)*(np.cos(Om)*np.sin(w+nu) + \
    np.sin(Om)*np.cos(w+nu)*np.cos(i))
    V_Y = (Y*h*e/(r*p))*np.sin(nu) - (h/r)*(np.sin(Om)*np.sin(w+nu) - \
    np.cos(Om)*np.cos(w+nu)*np.cos(i))
    V_Z = (Z*h*e/(r*p))*np.sin(nu) - (h/r)*(np.cos(w+nu)*np.sin(i))

    return [X,Y,Z],[V_X,V_Y,V_Z]

# a,e,i,omega_AP,omega_LAN,T, EA = cart_2_kep(r_test,v_test)

'''
a - semi-major axis
e - eccentricity
i - inclination
omega_AP - argument of periapsis
omega_LAN - longitude ascending node
EA - eccentric anomaly
'''

a = 1000 # 5536635.97827
e = 0 # 0.260350152613
i = 0 # 7.16528963794e-06
omega_AP = 0 # -1.57079632679
omega_LAN = 0 # -1.57079632679
T = -2049.98160208
EA = 3.14159265359

print('Time of Periapsis Passage: ' + str(T))
print('Eccentric Anomaly: ' + str(EA) + '\n\n')
print('Semi Major Axis: ' + str(a))
print('Eccentricity: ' + str(e))
print('Inclination: ' + str(i))
print('Argumentof Periapsis: ' + str(omega_AP))
print('Longitude of Ascending Node: ' + str(omega_LAN))

for number in range(0, 361):
    r_test2, v_test2 = kep_2_cart(a,e,i,omega_AP,omega_LAN,T, EA)

print(r_test2)
print(v_test2)
