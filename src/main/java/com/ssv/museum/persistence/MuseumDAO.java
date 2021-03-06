/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ssv.museum.persistence;

import com.ssv.museum.core.Museum;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Data Access Object for Museum entity
 * Also contains method findByUsernam which is Museum specific
 * @author simonarneson
 */
@Stateless
public class MuseumDAO extends AbstractDAO<Museum, Long> {

    @PersistenceContext
    private EntityManager em;
    
    public MuseumDAO(){
        super(Museum.class);
    }
    
    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public Museum findByUsername(String username) {
         List<Museum> museums  = em.createQuery("SELECT m FROM Museum m WHERE m.username = :username", Museum.class)
                .setParameter("username", username).getResultList();
        if(museums.isEmpty())
            return null;
        else
            return museums.get(0);
    }
    
}

